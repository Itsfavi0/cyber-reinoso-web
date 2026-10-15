import { useEffect, useRef, useState } from 'react'
import { CircleCheck, Send } from 'lucide-react'
import { MESSAGE_MAX, validateDemoRequest } from '../../lib/validateDemoRequest'
import { Field } from './Field'
import { describedBy, inputClass } from './fieldHelpers'

const EMPTY = { name: '', email: '', venue: '', stations: '', message: '' }
const FIELD_ORDER = ['name', 'email', 'stations', 'message']
const STATION_OPTIONS = ['Hasta 10', 'De 11 a 25', 'De 26 a 50', 'Más de 50', 'Aún no tengo local']

export function DemoRequestForm() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sentTo, setSentTo] = useState(null)
  const fieldRefs = useRef({})
  const successRef = useRef(null)

  const errors = validateDemoRequest(values)
  const visibleError = (field) => (touched[field] || submitted ? errors[field] : undefined)

  useEffect(() => {
    if (sentTo) successRef.current?.focus()
  }, [sentTo])

  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  const markTouched = (field) => () => setTouched((current) => ({ ...current, [field]: true }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus()
      return
    }
    // No hay backend: la solicitud solo se confirma en la página.
    setSentTo({ name: values.name.trim().split(' ')[0], email: values.email.trim() })
  }

  const reset = () => {
    setValues(EMPTY)
    setTouched({})
    setSubmitted(false)
    setSentTo(null)
  }

  const inputProps = (field, hint, extraClass = '') => ({
    id: `demo-${field}`,
    ref: (node) => {
      fieldRefs.current[field] = node
    },
    value: values[field],
    onChange: update(field),
    onBlur: markTouched(field),
    'aria-invalid': visibleError(field) ? true : undefined,
    'aria-describedby': describedBy(`demo-${field}`, { hint, error: visibleError(field) }),
    className: `${inputClass} ${extraClass} ${visibleError(field) ? 'border-signal' : 'border-line-strong'}`,
  })

  if (sentTo) {
    return (
      <div className="hud-frame self-start bg-mint/40 p-px">
        <div className="hud-frame bg-panel p-6 sm:p-8">
          <CircleCheck className="size-8 text-mint" aria-hidden="true" />
          <h3 ref={successRef} tabIndex={-1} className="mt-4 text-2xl font-semibold outline-none">
            Solicitud recibida, {sentTo.name}
          </h3>
          <p className="mt-3 text-muted">
            Te escribiré a <span className="break-all text-text">{sentTo.email}</span> para coordinar la demo. Esta
            página es de portafolio, así que el formulario no envía datos a ningún servidor.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center rounded-md border border-line-strong px-5 text-sm font-medium text-text transition-[border-color,transform] duration-150 hover:border-ice/60 active:scale-[0.97]"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    )
  }

  const messageHint = `${values.message.length} de ${MESSAGE_MAX} caracteres`
  
  return (
    <div className="hud-frame self-start bg-line-strong/60 p-px">
      <form noValidate onSubmit={handleSubmit} className="hud-frame bg-panel p-6 sm:p-8" aria-labelledby="form-title">
        <h3 id="form-title" className="text-xl font-semibold">
          Solicitar una demo
        </h3>
        <p className="mt-1 text-sm text-muted">Toma menos de un minuto. Todos los campos son obligatorios salvo los marcados como opcionales.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field id="demo-name" label="Nombre" error={visibleError('name')}>
            <input type="text" autoComplete="name" {...inputProps('name')} />
          </Field>
          <Field id="demo-email" label="Correo" error={visibleError('email')}>
            <input type="email" autoComplete="email" inputMode="email" placeholder="tu@example.com" {...inputProps('email')} />
          </Field>
          <Field id="demo-venue" label="Nombre del local" optional>
            <input
              id="demo-venue"
              type="text"
              autoComplete="organization"
              value={values.venue}
              onChange={update('venue')}
              className={`${inputClass} border-line-strong`}
            />
          </Field>
          <Field id="demo-stations" label="Estaciones" error={visibleError('stations')}>
            <select {...inputProps('stations')}>
              <option value="">Elige una opción</option>
              {STATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field id="demo-message" label="¿Qué te gustaría ver?" optional hint={messageHint} error={visibleError('message')}>
              <textarea rows={4} {...inputProps('message', messageHint, 'py-3')} />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-md bg-ice px-6 font-semibold text-night transition-[background-color,transform] duration-150 ease-out hover:bg-[#9ad5ff] active:scale-[0.97] sm:w-auto"
        >
          <Send className="size-4" aria-hidden="true" />
          Solicitar demo
        </button>
      </form>
    </div>
  )
}
