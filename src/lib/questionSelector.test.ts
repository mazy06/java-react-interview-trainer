import { describe, expect, it } from 'vitest'
import { selectSessionQuestions, shuffleOptions } from './questionSelector'
import questionsData from '../data/questions.json'
import type { Question } from '../types/question'
import type { ProgressState } from '../types/progress'
import type { SessionConfig } from '../types/session'
import { createConceptProgress, recordConceptAttempt } from './spacedRepetition'

const questions = questionsData as Question[]

const EMPTY_PROGRESS: ProgressState = {
  concepts: {},
  questions: {},
  bestStreak: 0,
  currentStreak: 0,
}

function baseConfig(overrides: Partial<SessionConfig> = {}): SessionConfig {
  return {
    questionCount: 5,
    themes: [],
    difficulty: 'mixed',
    mode: 'training',
    timerEnabled: false,
    instantCorrection: true,
    shuffleOptions: false,
    ...overrides,
  }
}

describe('selectSessionQuestions - filtres', () => {
  it('ne retourne que les questions du thème demandé', () => {
    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ themes: ['SQL'], questionCount: 100 }),
      progress: EMPTY_PROGRESS,
    })
    expect(selected.length).toBeGreaterThan(0)
    expect(selected.every((q) => q.theme === 'SQL')).toBe(true)
  })

  it('ne retourne que les questions de la difficulté demandée', () => {
    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ difficulty: 'junior', questionCount: 200 }),
      progress: EMPTY_PROGRESS,
    })
    expect(selected.length).toBeGreaterThan(0)
    expect(selected.every((q) => q.difficulty === 'junior')).toBe(true)
  })

  it('respecte le nombre de questions demandé quand assez de questions sont disponibles', () => {
    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ questionCount: 7 }),
      progress: EMPTY_PROGRESS,
    })
    expect(selected).toHaveLength(7)
  })
})

describe('selectSessionQuestions - mode révision des erreurs', () => {
  it('permet à une question React sur une course réseau de revenir après une erreur', () => {
    const raceConditionQuestion = questions.find(
      (q) => q.theme === 'React' && q.keyConcept === 'network-race-condition',
    )
    expect(raceConditionQuestion).toBeDefined()
    const question = raceConditionQuestion as Question

    // Simule un échec précédent sur cette question et son concept.
    let conceptProgress = createConceptProgress(question.keyConcept)
    conceptProgress = recordConceptAttempt(conceptProgress, false, question.reviewIntervals)

    const progressAfterError: ProgressState = {
      concepts: { [question.keyConcept]: conceptProgress },
      questions: {
        [question.id]: {
          questionId: question.id,
          favorite: false,
          reviewLater: false,
          reportedIssue: false,
          lastResult: 'incorrect',
          attempts: 1,
        },
      },
      bestStreak: 0,
      currentStreak: 0,
    }

    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ mode: 'review-errors', questionCount: questions.length }),
      progress: progressAfterError,
    })

    expect(selected.some((q) => q.id === question.id)).toBe(true)
  })

  it('exclut les questions dont le concept est maîtrisé en mode révision des erreurs', () => {
    const question = questions.find((q) => q.theme === 'Java')!
    let conceptProgress = createConceptProgress(question.keyConcept)
    conceptProgress = recordConceptAttempt(conceptProgress, true, question.reviewIntervals)
    conceptProgress = recordConceptAttempt(conceptProgress, true, question.reviewIntervals)

    const progress: ProgressState = {
      concepts: { [question.keyConcept]: conceptProgress },
      questions: {
        [question.id]: {
          questionId: question.id,
          favorite: false,
          reviewLater: false,
          reportedIssue: false,
          lastResult: 'correct',
          attempts: 2,
        },
      },
      bestStreak: 2,
      currentStreak: 2,
    }

    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ mode: 'review-errors', questionCount: questions.length }),
      progress,
    })

    expect(selected.some((q) => q.id === question.id)).toBe(false)
  })
})

describe('selectSessionQuestions - favoris', () => {
  it('ne retourne que les questions marquées favorites', () => {
    const favoriteQuestion = questions[3]
    const progress: ProgressState = {
      concepts: {},
      questions: {
        [favoriteQuestion.id]: {
          questionId: favoriteQuestion.id,
          favorite: true,
          reviewLater: false,
          reportedIssue: false,
          lastResult: null,
          attempts: 0,
        },
      },
      bestStreak: 0,
      currentStreak: 0,
    }

    const selected = selectSessionQuestions({
      questions,
      config: baseConfig({ mode: 'favorites', questionCount: 50 }),
      progress,
    })

    expect(selected).toHaveLength(1)
    expect(selected[0].id).toBe(favoriteQuestion.id)
  })
})

describe('shuffleOptions', () => {
  it('conserve tous les éléments après mélange', () => {
    const options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    const shuffled = shuffleOptions(options, () => 0.5)
    expect(shuffled).toHaveLength(3)
    expect(shuffled.map((o) => o.id).sort()).toEqual(['a', 'b', 'c'])
  })
})
