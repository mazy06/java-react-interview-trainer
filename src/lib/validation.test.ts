import { describe, expect, it } from 'vitest'
import { validateAppExport, validateQuestionsImport } from './validation'

describe('validateQuestionsImport', () => {
  it('accepte un tableau de questions valides', () => {
    const result = validateQuestionsImport([
      {
        id: 'CUSTOM-1',
        source: 'added',
        sourcePage: null,
        chapter: 'Custom',
        theme: 'Java',
        subtheme: 'Custom',
        difficulty: 'junior',
        type: 'mcq',
        question: 'Une question ?',
        options: [{ id: 'a', text: 'A' }],
        correctOptionIds: ['a'],
        explanation: 'x',
        commonTrap: 'x',
        keyConcept: 'custom-concept',
        tags: [],
        relatedQuestionIds: [],
        reviewIntervals: [1, 3, 7, 14],
        isOriginalPdfContent: false,
        proofType: 'definition',
      },
    ])
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejette un fichier qui n’est pas un tableau', () => {
    const result = validateQuestionsImport({ not: 'an array' })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('rejette une question mcq sans options', () => {
    const result = validateQuestionsImport([
      {
        id: 'BAD-1',
        chapter: 'x',
        theme: 'Java',
        subtheme: 'x',
        difficulty: 'junior',
        type: 'mcq',
        question: 'x',
        keyConcept: 'x',
        commonTrap: 'x',
        tags: [],
        relatedQuestionIds: [],
      },
    ])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('options'))).toBe(true)
  })

  it('rejette des identifiants dupliqués dans le même import', () => {
    const question = {
      id: 'DUP-1',
      chapter: 'x',
      theme: 'Java',
      subtheme: 'x',
      difficulty: 'junior',
      type: 'mcq',
      question: 'x',
      keyConcept: 'x',
      commonTrap: 'x',
      tags: [],
      relatedQuestionIds: [],
      options: [{ id: 'a', text: 'A' }],
      correctOptionIds: ['a'],
    }
    const result = validateQuestionsImport([question, question])
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('double'))).toBe(true)
  })
})

describe('validateAppExport', () => {
  it('accepte une exportation complète valide', () => {
    const result = validateAppExport({
      version: 1,
      exportedAt: '2026-01-01T00:00:00.000Z',
      progress: { concepts: {}, questions: {} },
      sessions: [],
    })
    expect(result.valid).toBe(true)
  })

  it('rejette un objet sans champ progress', () => {
    const result = validateAppExport({ version: 1, exportedAt: 'x', sessions: [] })
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('progress'))).toBe(true)
  })

  it('rejette une valeur qui n’est pas un objet', () => {
    const result = validateAppExport('not an object')
    expect(result.valid).toBe(false)
  })
})
