export const inputClass =
  'mt-2 block min-h-12 w-full rounded-md border bg-night px-3.5 text-base text-text placeholder:text-faint transition-colors duration-150 focus:border-ice focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice'

export function describedBy(id, { hint, error }) {
  if (error) return `${id}-error`
  return hint ? `${id}-hint` : undefined
}
