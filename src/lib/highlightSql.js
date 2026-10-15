const KEYWORDS = new Set(
  'SELECT FROM WHERE UPDATE SET INSERT INTO VALUES OUTPUT INSERTED CASE WHEN THEN ELSE END AND OR INNER JOIN ON COLLATE AS MAX CAST SUBSTRING LEN LIKE INT'.split(' '),
)

// Un tokenizador mínimo: comentarios, cadenas, parámetros, números, palabras y el resto.
const TOKEN_PATTERN = /(--[^\n]*)|('(?:[^']|'')*')|(\?)|(\b\d+\b)|([A-Za-z_][\w.]*)|(\s+|[^\sA-Za-z_\d'?-]+|-)/g

/** Convierte SQL en una lista de { text, kind } para pintarlo sin usar innerHTML. */
export function highlightSql(code) {
  const tokens = []
  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const [text, comment, string, param, number, word] = match
    let kind = 'plain'
    if (comment) kind = 'comment'
    else if (string) kind = 'string'
    else if (param) kind = 'param'
    else if (number) kind = 'number'
    else if (word && KEYWORDS.has(word.toUpperCase())) kind = 'keyword'
    tokens.push({ text, kind })
  }
  return tokens
}
