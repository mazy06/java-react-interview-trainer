import type { ReactNode } from 'react'

const JAVA_KEYWORDS = new Set([
  'public',
  'private',
  'protected',
  'static',
  'final',
  'void',
  'class',
  'interface',
  'extends',
  'implements',
  'new',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'try',
  'catch',
  'finally',
  'throw',
  'throws',
  'import',
  'package',
  'this',
  'super',
  'null',
  'true',
  'false',
  'int',
  'long',
  'float',
  'double',
  'boolean',
  'char',
  'byte',
  'short',
  'var',
  'enum',
  'abstract',
  'instanceof',
])

const JS_KEYWORDS = new Set([
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'try',
  'catch',
  'finally',
  'throw',
  'new',
  'this',
  'const',
  'let',
  'var',
  'class',
  'extends',
  'import',
  'export',
  'from',
  'null',
  'undefined',
  'true',
  'false',
  'typeof',
  'instanceof',
  'in',
  'of',
  'async',
  'await',
  'yield',
  'void',
])

const TOKEN_REGEX =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?[fFlL]?\b)|(\b[A-Za-z_$][A-Za-z0-9_$]*\b)/g

// Coloration syntaxique minimale (sans dépendance) pour les extraits Java/JS de la page Katas Big O.
export function highlightCode(code: string, lang: 'java' | 'javascript'): ReactNode[] {
  const keywords = lang === 'java' ? JAVA_KEYWORDS : JS_KEYWORDS
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  TOKEN_REGEX.lastIndex = 0
  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index))
    }
    const [full, lineComment, blockComment, string, number, word] = match

    if (lineComment || blockComment) {
      nodes.push(
        <span key={key++} className="italic text-slate-500">
          {full}
        </span>,
      )
    } else if (string) {
      nodes.push(
        <span key={key++} className="text-amber-300">
          {full}
        </span>,
      )
    } else if (number) {
      nodes.push(
        <span key={key++} className="text-purple-300">
          {full}
        </span>,
      )
    } else if (word) {
      if (keywords.has(word)) {
        nodes.push(
          <span key={key++} className="text-sky-400">
            {full}
          </span>,
        )
      } else if (/^[A-Z]/.test(word)) {
        nodes.push(
          <span key={key++} className="text-teal-300">
            {full}
          </span>,
        )
      } else {
        nodes.push(full)
      }
    }

    lastIndex = TOKEN_REGEX.lastIndex
  }

  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex))
  }

  return nodes
}
