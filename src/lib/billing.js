// Reglas de negocio portadas de modelos.py y main.py (Cyber Reinoso).

export const RANKS = [
  { name: 'Bronce', fromMinutes: 0, discount: 0 },
  { name: 'Plata', fromMinutes: 600, discount: 0.05 },
  { name: 'Oro', fromMinutes: 3000, discount: 0.1 },
  { name: 'Diamante', fromMinutes: 6000, discount: 0.15 },
]

/** Equivale a Usuario.evaluar_rango_por_minutos(). */
export function rankFor(minutes) {
  return [...RANKS].reverse().find((rank) => minutes >= rank.fromMinutes)
}

export function nextRank(minutes) {
  return RANKS.find((rank) => rank.fromMinutes > minutes) ?? null
}

/** Equivale a calcular_tarifa(minutos): tarifa_hora / 60 * minutos, redondeado a 2 decimales. */
export function costFor(ratePerHour, minutes) {
  return Math.round((ratePerHour / 60) * minutes * 100) / 100
}

/** Costo con el descuento VIP del rango aplicado. */
export function discountedCost(ratePerHour, minutes, discount) {
  return costFor(ratePerHour, minutes) * (1 - discount)
}

/**
 * Kill Switch, igual que actualizar_cronometros(): si el costo proyectado del
 * próximo minuto (con descuento) supera el saldo inicial de la sesión, se corta.
 */
export function shouldCut({ ratePerHour, elapsedSeconds, discount, startBalance }) {
  const nextMinute = Math.floor(elapsedSeconds / 60) + 1
  return discountedCost(ratePerHour, nextMinute, discount) > startBalance
}

export function formatSoles(amount) {
  return `S/ ${Math.max(0, amount).toFixed(2)}`
}

export function formatClock(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function formatHours(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
