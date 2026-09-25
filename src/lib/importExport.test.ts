import { describe, expect, it } from 'vitest'
import { mergeImportedQuestions } from './importExport'
import type { Question } from '../types/question'

function makeQuestion(id: string): Question {
  return {
    id,
    source: 'added',
    sourcePage: null,
    chapter: 'Custom',
    theme: 'Java',
    subtheme: 'Custom',
    difficulty: 'junior',
    type: 'mcq',
    question: `Question ${id}`,
    options: [{ id: 'a', text: 'A' }],
    correctOptionIds: ['a'],
    explanation: 'x',
    commonTrap: 'x',
    keyConcept: `concept-${id}`,
    tags: [],
    relatedQuestionIds: [],
    reviewIntervals: [1, 3, 7, 14],
    isOriginalPdfContent: false,
    proofType: 'definition',
  }
}

describe('mergeImportedQuestions', () => {
  it('ajoute les nouvelles questions sans doublon', () => {
    const existing = [makeQuestion('A')]
    const imported = [makeQuestion('B'), makeQuestion('C')]
    const result = mergeImportedQuestions(existing, imported)

    expect(result.addedCount).toBe(2)
    expect(result.merged).toHaveLength(3)
    expect(result.skippedDuplicateIds).toHaveLength(0)
  })

  it('n’écrase jamais silencieusement une question existante avec le même identifiant', () => {
    const existing = [makeQuestion('A')]
    const imported = [{ ...makeQuestion('A'), question: 'Version modifiée' }]
    const result = mergeImportedQuestions(existing, imported)

    expect(result.addedCount).toBe(0)
    expect(result.skippedDuplicateIds).toEqual(['A'])
    expect(result.merged).toHaveLength(1)
    expect(result.merged[0].question).toBe('Question A')
  })
})
