import { describe, expect, it } from 'vitest'
import {
  computePriorityScore,
  createConceptProgress,
  isDueForReview,
  recordConceptAttempt,
} from './spacedRepetition'

const REVIEW_INTERVALS = [1, 3, 7, 14]

describe('recordConceptAttempt', () => {
  it('augmente la priorité (rapproche la prochaine révision) après une erreur', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    let progress = createConceptProgress('concept-x', now)
    progress = recordConceptAttempt(progress, true, REVIEW_INTERVALS, now)

    const afterSuccessNextReview = new Date(progress.nextReviewAt).getTime()

    const later = new Date('2026-01-02T00:00:00.000Z')
    const afterError = recordConceptAttempt(progress, false, REVIEW_INTERVALS, later)

    expect(afterError.streak).toBe(0)
    expect(new Date(afterError.nextReviewAt).getTime()).toBeLessThan(
      afterSuccessNextReview + 20 * 24 * 60 * 60 * 1000,
    )
    expect(afterError.difficultyAdjustment).toBeGreaterThan(progress.difficultyAdjustment)
  })

  it('diminue progressivement la priorité après des réussites successives (intervalle plus grand)', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    let progress = createConceptProgress('concept-y', now)
    progress = recordConceptAttempt(progress, true, REVIEW_INTERVALS, now)
    const firstInterval = new Date(progress.nextReviewAt).getTime() - now.getTime()

    progress = recordConceptAttempt(progress, true, REVIEW_INTERVALS, now)
    const secondInterval = new Date(progress.nextReviewAt).getTime() - now.getTime()

    expect(secondInterval).toBeGreaterThan(firstInterval)
    expect(progress.streak).toBe(2)
  })

  it('met à jour le taux de réussite correctement', () => {
    const now = new Date()
    let progress = createConceptProgress('concept-z', now)
    progress = recordConceptAttempt(progress, true, REVIEW_INTERVALS, now)
    progress = recordConceptAttempt(progress, false, REVIEW_INTERVALS, now)
    expect(progress.attempts).toBe(2)
    expect(progress.correctAnswers).toBe(1)
    expect(progress.wrongAnswers).toBe(1)
    expect(progress.successRate).toBeCloseTo(0.5)
  })
})

describe('isDueForReview / computePriorityScore', () => {
  it('considère un concept jamais révisé comme dû immédiatement', () => {
    const now = new Date()
    const progress = createConceptProgress('fresh-concept', now)
    expect(isDueForReview(progress, now)).toBe(true)
  })

  it('donne une priorité plus élevée à un concept en échec qu’à un concept maîtrisé', () => {
    const now = new Date()
    let struggling = createConceptProgress('struggling', now)
    struggling = recordConceptAttempt(struggling, false, REVIEW_INTERVALS, now)

    let mastered = createConceptProgress('mastered', now)
    mastered = recordConceptAttempt(mastered, true, REVIEW_INTERVALS, now)
    mastered = recordConceptAttempt(mastered, true, REVIEW_INTERVALS, now)

    expect(computePriorityScore(struggling, now)).toBeGreaterThan(
      computePriorityScore(mastered, now),
    )
  })
})
