const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MESSAGE_MAX = 500

/** Devuelve un objeto { campo: mensaje } solo con los campos que tienen error. */
export function validateDemoRequest(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()

  if (!name) errors.name = 'Escribe tu nombre.'
  else if (name.length < 2) errors.name = 'El nombre debe tener al menos 2 letras.'

  if (!email) errors.email = 'Escribe tu correo para poder responderte.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Revisa el correo: debe tener la forma nombre@dominio.com.'

  if (!values.stations) errors.stations = 'Elige cuántas estaciones tiene tu local.'

  if (values.message.length > MESSAGE_MAX) {
    errors.message = `El mensaje supera los ${MESSAGE_MAX} caracteres.`
  }
  return errors
}
