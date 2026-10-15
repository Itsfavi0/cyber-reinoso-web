import { useEffect, useRef, useState } from 'react'

/** Devuelve [ref, estaVisible]. Sirve para pausar trabajo cuando el elemento sale de pantalla. */
export function useInView({ rootMargin = '0px', once = false } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView]
}
