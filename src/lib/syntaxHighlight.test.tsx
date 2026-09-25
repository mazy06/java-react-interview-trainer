import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { highlightCode } from './syntaxHighlight'

describe('highlightCode', () => {
  it('préserve le texte intégral du code', () => {
    const code = 'static int add(int a, int b) { return a + b; }'
    const { container } = render(<>{highlightCode(code, 'java')}</>)
    expect(container.textContent).toBe(code)
  })

  it('colore les mots-clés Java', () => {
    const code = 'static int x = 1;'
    const { container } = render(<>{highlightCode(code, 'java')}</>)
    const staticSpan = Array.from(container.querySelectorAll('span')).find(
      (el) => el.textContent === 'static',
    )
    expect(staticSpan).toBeDefined()
    expect(staticSpan?.className).toContain('text-sky-400')
  })

  it('colore les chaînes de caractères', () => {
    const code = 'const msg = "hello";'
    const { container } = render(<>{highlightCode(code, 'javascript')}</>)
    const stringSpan = Array.from(container.querySelectorAll('span')).find((el) =>
      el.textContent?.includes('"hello"'),
    )
    expect(stringSpan).toBeDefined()
    expect(stringSpan?.className).toContain('text-amber-300')
  })

  it('colore les commentaires', () => {
    const code = '// un commentaire\nconst x = 1;'
    const { container } = render(<>{highlightCode(code, 'javascript')}</>)
    const commentSpan = Array.from(container.querySelectorAll('span')).find((el) =>
      el.textContent?.includes('un commentaire'),
    )
    expect(commentSpan).toBeDefined()
    expect(commentSpan?.className).toContain('text-slate-500')
  })
})
