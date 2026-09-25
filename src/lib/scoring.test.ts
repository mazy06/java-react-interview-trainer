import { describe, expect, it } from 'vitest'
import { computeSessionScore, isAttemptCorrect, isMcqAnswerCorrect } from './scoring'
import type { McqQuestion } from '../types/question'
import type { QuestionAttempt } from '../types/session'

function makeMcq(overrides: Partial<McqQuestion> = {}): McqQuestion {
  return {
    id: 'Q1',
    source: 'pdf',
    sourcePage: 1,
    chapter: 'Test',
    theme: 'Java',
    subtheme: 'Test',
    difficulty: 'junior',
    type: 'mcq',
    question: 'Question ?',
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctOptionIds: ['a'],
    explanation: 'Explication',
    commonTrap: 'Piège',
    keyConcept: 'test-concept',
    tags: [],
    relatedQuestionIds: [],
    reviewIntervals: [1, 3, 7, 14],
    isOriginalPdfContent: true,
    proofType: 'definition',
    ...overrides,
  }
}

function makeAttempt(overrides: Partial<QuestionAttempt> = {}): QuestionAttempt {
  return {
    questionId: 'Q1',
    isCorrect: null,
    selectedOptionIds: [],
    selfRating: null,
    timeSpentMs: 1000,
    didNotKnow: false,
    flaggedForReview: false,
    reportedIssue: false,
    understoodExplanation: null,
    ...overrides,
  }
}

describe('isMcqAnswerCorrect', () => {
  it('renvoie true quand les options sélectionnées correspondent exactement', () => {
    const question = makeMcq({ correctOptionIds: ['a', 'b'] })
    expect(isMcqAnswerCorrect(question, ['b', 'a'])).toBe(true)
  })

  it('renvoie false si une option correcte manque', () => {
    const question = makeMcq({ correctOptionIds: ['a', 'b'] })
    expect(isMcqAnswerCorrect(question, ['a'])).toBe(false)
  })

  it('renvoie false si une option incorrecte est incluse en plus', () => {
    const question = makeMcq({ correctOptionIds: ['a'] })
    expect(isMcqAnswerCorrect(question, ['a', 'b'])).toBe(false)
  })
})

describe('isAttemptCorrect', () => {
  it('renvoie false si didNotKnow est vrai, même si isCorrect est vrai', () => {
    expect(isAttemptCorrect(makeAttempt({ isCorrect: true, didNotKnow: true }))).toBe(false)
  })

  it('utilise isCorrect en priorité pour un mcq', () => {
    expect(isAttemptCorrect(makeAttempt({ isCorrect: false }))).toBe(false)
    expect(isAttemptCorrect(makeAttempt({ isCorrect: true }))).toBe(true)
  })

  it('utilise le seuil d’auto-évaluation pour une question ouverte (>= 3)', () => {
    expect(isAttemptCorrect(makeAttempt({ isCorrect: null, selfRating: 2 }))).toBe(false)
    expect(isAttemptCorrect(makeAttempt({ isCorrect: null, selfRating: 3 }))).toBe(true)
    expect(isAttemptCorrect(makeAttempt({ isCorrect: null, selfRating: 4 }))).toBe(true)
  })
})

describe('computeSessionScore', () => {
  it('calcule le score et le pourcentage de réussite', () => {
    const attempts = [
      makeAttempt({ isCorrect: true }),
      makeAttempt({ isCorrect: true }),
      makeAttempt({ isCorrect: false }),
      makeAttempt({ isCorrect: false }),
    ]
    const result = computeSessionScore(attempts)
    expect(result.totalQuestions).toBe(4)
    expect(result.score).toBe(2)
    expect(result.successRatePercent).toBe(50)
  })

  it('renvoie 0% pour une session sans réponse', () => {
    const result = computeSessionScore([])
    expect(result.successRatePercent).toBe(0)
    expect(result.totalQuestions).toBe(0)
  })
})
