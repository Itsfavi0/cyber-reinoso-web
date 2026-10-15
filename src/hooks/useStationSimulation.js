import { useEffect, useReducer } from 'react'
import { CATEGORIES, GAMERS, STATIONS } from '../data/catalog'
import { costFor, discountedCost, formatSoles, rankFor, shouldCut } from '../lib/billing'

export const SPEEDS = { fast: 60, realtime: 1 }
const TOP_UP_AMOUNT = 5
const MAX_LOG_ENTRIES = 30
const SIM_DAY_START = (18 * 60 + 40) * 60 // la simulación arranca a las 18:40

// Sesiones que ya están en curso cuando se abre la demo (minutos transcurridos).
// Wacho entra con poco saldo para que el Kill Switch se vea en los primeros segundos.
const OPENING_SESSIONS = {
  'PC-001': { gamerId: 2, elapsedMinutes: 38 },
  'PC-002': { gamerId: 6, elapsedMinutes: 140 },
  'PC-005': { gamerId: 3, elapsedMinutes: 72 },
  'PC-006': { gamerId: 7, elapsedMinutes: 25 },
  'PC-009': { gamerId: 4, elapsedMinutes: 95 },
  'PC-010': { gamerId: 5, elapsedMinutes: 160 },
  'PC-012': { gamerId: 8, elapsedMinutes: 48 },
}

function rateOf(station) {
  return CATEGORIES[station.category].ratePerHour
}

function createSession(gamer, elapsedSeconds = 0) {
  return {
    gamerId: gamer.id,
    startBalance: gamer.balance,
    discount: rankFor(gamer.minutes).discount,
    elapsedSeconds,
  }
}

export function createInitialState() {
  const gamers = Object.fromEntries(GAMERS.map((gamer) => [gamer.id, { ...gamer }]))
  const stations = STATIONS.map((station) => {
    const opening = OPENING_SESSIONS[station.code]
    if (station.maintenance) return { ...station, status: 'maintenance', session: null }
    if (!opening) return { ...station, status: 'available', session: null }
    const session = createSession(gamers[opening.gamerId], opening.elapsedMinutes * 60)
    return { ...station, status: 'busy', session }
  })

  return {
    stations,
    gamers,
    selectedCode: 'PC-002',
    clock: SIM_DAY_START,
    speed: SPEEDS.fast,
    paused: false,
    log: [{ id: 0, clock: SIM_DAY_START, type: 'info', text: 'Turno abierto por renzo_caja (Cajero). 7 sesiones recuperadas desde SQL Server.' }],
    nextLogId: 1,
    lastCut: null,
  }
}

/** Saldo que le queda al gamer si la sesión se cerrara ahora mismo. */
export function remainingBalance(station) {
  const { session } = station
  if (!session) return 0
  const minutes = Math.floor(session.elapsedSeconds / 60)
  return session.startBalance - discountedCost(rateOf(station), minutes, session.discount)
}

function addLog(state, type, text) {
  const entry = { id: state.nextLogId, clock: state.clock, type, text }
  return { ...state, log: [entry, ...state.log].slice(0, MAX_LOG_ENTRIES), nextLogId: state.nextLogId + 1 }
}

/** Equivale a Sesion.finalizar_sesion(): cobra con descuento VIP y suma minutos al gamer. */
function closeSession(state, code, isAutomaticCut) {
  const station = state.stations.find((s) => s.code === code)
  const { session } = station
  const gamer = state.gamers[session.gamerId]
  const minutes = Math.max(1, Math.floor(session.elapsedSeconds / 60))
  const owed = discountedCost(rateOf(station), minutes, session.discount)
  const charged = Math.min(owed, gamer.balance)
  const previousRank = rankFor(gamer.minutes).name
  const updatedGamer = { ...gamer, balance: Math.max(0, gamer.balance - charged), minutes: gamer.minutes + minutes }
  const newRank = rankFor(updatedGamer.minutes).name

  let next = {
    ...state,
    gamers: { ...state.gamers, [gamer.id]: updatedGamer },
    stations: state.stations.map((s) => (s.code === code ? { ...s, status: 'available', session: null } : s)),
  }

  next = isAutomaticCut
    ? addLog(next, 'cut', `Kill Switch en ${code}: saldo de ${gamer.alias} agotado. Cobrado ${formatSoles(charged)}, estación liberada.`)
    : addLog(next, 'end', `${code} cerrada por caja. ${gamer.alias} pagó ${formatSoles(charged)} por ${minutes} min.`)

  if (newRank !== previousRank) {
    next = addLog(next, 'rank', `${gamer.alias} sube a rango ${newRank}.`)
  }
  return isAutomaticCut ? { ...next, lastCut: { code, id: next.nextLogId } } : next
}

function tick(state) {
  if (state.paused) return state
  let next = {
    ...state,
    clock: state.clock + state.speed,
    stations: state.stations.map((station) =>
      station.session
        ? { ...station, session: { ...station.session, elapsedSeconds: station.session.elapsedSeconds + state.speed } }
        : station,
    ),
  }

  for (const station of next.stations) {
    if (!station.session) continue
    const { elapsedSeconds, discount, startBalance } = station.session
    if (shouldCut({ ratePerHour: rateOf(station), elapsedSeconds, discount, startBalance })) {
      next = closeSession(next, station.code, true)
    }
  }
  return next
}

function startSession(state, code, gamerId) {
  const station = state.stations.find((s) => s.code === code)
  const gamer = state.gamers[gamerId]
  const isPlaying = state.stations.some((s) => s.session?.gamerId === gamerId)
  if (!station || station.status !== 'available' || !gamer || isPlaying) return state
  if (costFor(rateOf(station), 1) > gamer.balance) {
    return addLog(state, 'warn', `${gamer.alias} no tiene saldo para iniciar en ${code}. Recarga primero.`)
  }
  const next = {
    ...state,
    stations: state.stations.map((s) => (s.code === code ? { ...s, status: 'busy', session: createSession(gamer) } : s)),
  }
  return addLog(next, 'start', `${gamer.alias} inicia sesión en ${code} (${CATEGORIES[station.category].label}).`)
}

function topUp(state, gamerId) {
  const gamer = state.gamers[gamerId]
  const next = {
    ...state,
    gamers: { ...state.gamers, [gamerId]: { ...gamer, balance: gamer.balance + TOP_UP_AMOUNT } },
    stations: state.stations.map((s) =>
      s.session?.gamerId === gamerId ? { ...s, session: { ...s.session, startBalance: s.session.startBalance + TOP_UP_AMOUNT } } : s,
    ),
  }
  return addLog(next, 'recharge', `Recarga de ${formatSoles(TOP_UP_AMOUNT)} a la billetera de ${gamer.alias}.`)
}

function toggleMaintenance(state, code) {
  const station = state.stations.find((s) => s.code === code)
  if (!station || station.status === 'busy') return state
  const toMaintenance = station.status === 'available'
  const next = {
    ...state,
    stations: state.stations.map((s) => (s.code === code ? { ...s, status: toMaintenance ? 'maintenance' : 'available' } : s)),
  }
  return addLog(next, 'maintenance', toMaintenance ? `${code} enviada a mantenimiento.` : `${code} vuelve a estar operativa.`)
}

function reducer(state, action) {
  switch (action.type) {
    case 'tick':
      return tick(state)
    case 'select':
      return { ...state, selectedCode: action.code }
    case 'start':
      return startSession(state, action.code, action.gamerId)
    case 'end': {
      const station = state.stations.find((s) => s.code === action.code)
      return station?.session ? closeSession(state, action.code, false) : state
    }
    case 'topUp':
      return topUp(state, action.gamerId)
    case 'toggleMaintenance':
      return toggleMaintenance(state, action.code)
    case 'setSpeed':
      return { ...state, speed: action.speed }
    case 'togglePause':
      return { ...state, paused: !state.paused }
    case 'reset':
      return createInitialState()
    default:
      return state
  }
}

/**
 * Motor de la demo: un reloj de 1 s (como self.after(1000) en Tkinter) que solo corre
 * mientras la demo está en pantalla, para no gastar CPU fuera de ella.
 */
export function useStationSimulation(isActive) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  useEffect(() => {
    if (!isActive) return undefined
    const timer = setInterval(() => dispatch({ type: 'tick' }), 1000)
    return () => clearInterval(timer)
  }, [isActive])

  return [state, dispatch]
}
