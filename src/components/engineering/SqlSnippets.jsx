import { useMemo, useRef, useState } from 'react'
import { SQL_SNIPPETS } from '../../data/sqlSnippets'
import { highlightSql } from '../../lib/highlightSql'

const TOKEN_CLASS = {
  keyword: 'text-ice',
  string: 'text-mint',
  number: 'text-amber',
  param: 'text-amber',
  comment: 'text-faint italic',
  plain: 'text-text',
}

/** Pestañas accesibles (patrón ARIA tabs con flechas) con fragmentos reales de conexion.py. */
export function SqlSnippets() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef([])
  const active = SQL_SNIPPETS[activeIndex]
  const tokens = useMemo(() => highlightSql(active.code), [active])

  const focusTab = (index) => {
    const next = (index + SQL_SNIPPETS.length) % SQL_SNIPPETS.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event) => {
    const moves = { ArrowRight: activeIndex + 1, ArrowLeft: activeIndex - 1, Home: 0, End: SQL_SNIPPETS.length - 1 }
    if (event.key in moves) {
      event.preventDefault()
      focusTab(moves[event.key])
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div role="tablist" aria-label="Consultas SQL del sistema" className="flex overflow-x-auto border-b border-line" onKeyDown={onKeyDown}>
        {SQL_SNIPPETS.map((snippet, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={snippet.id}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`sql-tab-${snippet.id}`}
              aria-selected={isActive}
              aria-controls={`sql-panel-${snippet.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={`relative min-h-12 shrink-0 px-4 text-sm whitespace-nowrap transition-colors duration-150 ${
                isActive ? 'text-text' : 'text-muted hover:text-text'
              }`}
            >
              {snippet.tab}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-0.5 origin-center bg-ice transition-transform duration-200 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`sql-panel-${active.id}`} aria-labelledby={`sql-tab-${active.id}`}>
        <p className="border-b border-line px-4 py-3 text-sm text-muted sm:px-5">{active.why}</p>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:px-5" tabIndex={0} aria-label={`Código SQL de ${active.source}`}>
          <code>
            {tokens.map((token, index) => (
              <span key={index} className={TOKEN_CLASS[token.kind]}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
        <p className="border-t border-line px-4 py-2.5 font-mono text-xs text-faint sm:px-5">conexion.py, DBManager.{active.source}</p>
      </div>
    </div>
  )
}
