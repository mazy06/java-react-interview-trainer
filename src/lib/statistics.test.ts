import { describe, expect, it } from 'vitest'
import { buildAppStatistics, buildDailyPoints } from './statistics'
import type { Question } from '../types/question'
import type { QuestionAttempt, SessionResult } from '../types/session'

function makeQuestion(
  id: string,
  theme: Question['theme'],
  difficulty: Question['difficulty'],
): Question {
  return {
    id,
    source: 'pdf',
    sourcePage: 1,
    chapter: 'Test',
    theme,
    subtheme: 'Test',
    difficulty,
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
    isOriginalPdfContent: true,
    proofType: 'definition',
  }
}

function makeAttempt(questionId: string, isCorrect: boolean, timeSpentMs = 1000): QuestionAttempt {
  return {
    questionId,
    isCorrect,
    selectedOptionIds: [],
    selfRating: null,
    timeSpentMs,
    didNotKnow: false,
    flaggedForReview: false,
    reportedIssue: false,
    understoodExplanation: null,
  }
}

function makeSession(id: string, attempts: QuestionAttempt[], finishedAt: string): SessionResult {
  return {
    id,
    startedAt: finishedAt,
    finishedAt,
    mode: 'training',
    themes: [],
    difficulty: 'mixed',
    attempts,
    score: attempts.filter((a) => a.isCorrect).length,
    totalQuestions: attempts.length,
    totalTimeMs: attempts.reduce((s, a) => s + a.timeSpentMs, 0),
  }
}

describe('buildAppStatistics', () => {
  const q1 = makeQuestion('Q1', 'Java', 'junior')
  const q2 = makeQuestion('Q2', 'React', 'confirmed')

  it('calcule le taux de réussite global et par thème', () => {
    const sessions = [
      makeSession(
        's1',
        [makeAttempt('Q1', true), makeAttempt('Q2', false)],
        '2026-01-01T10:00:00.000Z',
      ),
    ]
    const stats = buildAppStatistics(sessions, [q1, q2])

    expect(stats.totalQuestionsAnswered).toBe(2)
    expect(stats.totalCorrect).toBe(1)
    expect(stats.globalSuccessRate).toBeCloseTo(0.5)

    const javaScore = stats.themeScores.find((t) => t.theme === 'Java')
    const reactScore = stats.themeScores.find((t) => t.theme === 'React')
    expect(javaScore?.successRate).toBe(1)
    expect(reactScore?.successRate).toBe(0)
  })

  it('distingue la réussite au premier essai de la réussite après répétition', () => {
    const sessions = [
      makeSession('s1', [makeAttempt('Q1', false)], '2026-01-01T10:00:00.000Z'),
      makeSession('s2', [makeAttempt('Q1', true)], '2026-01-02T10:00:00.000Z'),
    ]
    const stats = buildAppStatistics(sessions, [q1])
    expect(stats.firstAttemptSuccessRate).toBe(0)
    expect(stats.successRateAfterRepetition).toBe(1)
  })

  it('identifie les questions les plus souvent ratées', () => {
    const sessions = [
      makeSession(
        's1',
        [makeAttempt('Q1', false), makeAttempt('Q2', false)],
        '2026-01-01T10:00:00.000Z',
      ),
      makeSession('s2', [makeAttempt('Q1', false)], '2026-01-02T10:00:00.000Z'),
    ]
    const stats = buildAppStatistics(sessions, [q1, q2])
    expect(stats.mostMissedQuestionIds[0]).toEqual({ questionId: 'Q1', misses: 2 })
  })

  it('gère un historique vide sans erreur', () => {
    const stats = buildAppStatistics([], [q1, q2])
    expect(stats.totalQuestionsAnswered).toBe(0)
    expect(stats.globalSuccessRate).toBe(0)
    expect(stats.averageScore).toBe(0)
  })
})

describe('buildDailyPoints', () => {
  it('ignore les sessions en dehors de la fenêtre demandée', () => {
    const oldSession = makeSession('old', [makeAttempt('Q1', true)], '2020-01-01T00:00:00.000Z')
    const points = buildDailyPoints([oldSession], 30)
    expect(points).toHaveLength(0)
  })
})
