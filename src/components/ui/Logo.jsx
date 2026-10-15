export function LogoMark({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 6 54 14v18c0 13-9 22-22 26C19 54 10 45 10 32V14z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M21 26l5 4 6-7 6 7 5-4v11H21z" fill="currentColor" />
      <path d="M33 39l-4 7h4l-1 6 5-8h-4l1-5z" fill="var(--color-text)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-ice">
      <LogoMark />
      <span className="font-display text-lg font-semibold leading-none text-text">
        Cyber Reinoso
      </span>
    </span>
  )
}
