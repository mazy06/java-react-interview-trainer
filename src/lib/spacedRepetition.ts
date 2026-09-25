import type { ConceptProgress } from '../types/progress'
import type { SelfRating } from '../types/session'
import { addDays } from './dateUtils'

/**
 * Répétition espacée — algorithme volontairement simple et modifiable.
 *
 * Principe : chaque concept a un intervalle de révision qui grandit après une
 * réussite (on suit `reviewIntervals`, ex. [1, 3, 7, 14] jours) et qui retombe
 * après une erreur (le concept redevient prioritaire dès le lendemain).
 *
 * `difficultyAdjustment` (0.5 à 3) module l'intervalle réel : un concept
 * souvent raté voit son intervalle réduit (facteur > 1 divise l'intervalle),
 * un concept maîtrisé voit son intervalle légèrement étendu.
 */

const MIN_DIFFICULTY_ADJUSTMENT = 0.5
const MAX_DIFFICULTY_ADJUSTMENT = 3
const MAX_CONFIDENCE = 4

export function createConceptProgress(conceptId: string, now: Date = new Date()): ConceptProgress {
  return {
    conceptId,
    attempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    successRate: 0,
    lastAttemptAt: now.toISOString(),
    nextReviewAt: now.toISOString(),
    confidence: 0,
    streak: 0,
    difficultyAdjustment: 1,
  }
}

export function recordConceptAttempt(
  progress: ConceptProgress,
  isCorrect: boolean,
  reviewIntervals: number[],
  now: Date = new Date(),
  selfRating: SelfRating | null = null,
): ConceptProgress {
  const attempts = progress.attempts + 1
  const correctAnswers = progress.correctAnswers + (isCorrect ? 1 : 0)
  const wrongAnswers = progress.wrongAnswers + (isCorrect ? 0 : 1)
  const successRate = correctAnswers / attempts

  const streak = isCorrect ? progress.streak + 1 : 0

  let confidence = progress.confidence
  if (selfRating !== null) {
    confidence = selfRating
  } else {
    confidence = isCorrect ? Math.min(MAX_CONFIDENCE, confidence + 1) : Math.max(0, confidence - 1)
  }

  let difficultyAdjustment = progress.difficultyAdjustment
  if (isCorrect) {
    difficultyAdjustment = Math.max(MIN_DIFFICULTY_ADJUSTMENT, difficultyAdjustment - 0.15)
  } else {
    difficultyAdjustment = Math.min(MAX_DIFFICULTY_ADJUSTMENT, difficultyAdjustment + 0.5)
  }

  let nextReviewAt: string
  if (isCorrect) {
    const intervalIndex = Math.min(streak - 1, reviewIntervals.length - 1)
    const baseDays = reviewIntervals[Math.max(0, intervalIndex)] ?? 1
    const adjustedDays = Math.max(1, Math.round(baseDays / difficultyAdjustment))
    nextReviewAt = addDays(now, adjustedDays).toISOString()
  } else {
    // Une erreur augmente la priorité du concept : il revient dès le lendemain.
    nextReviewAt = addDays(now, 1).toISOString()
  }

  return {
    conceptId: progress.conceptId,
    attempts,
    correctAnswers,
    wrongAnswers,
    successRate,
    lastAttemptAt: now.toISOString(),
    nextReviewAt,
    confidence,
    streak,
    difficultyAdjustment,
  }
}

/**
 * Score de priorité : plus il est élevé, plus le concept doit être révisé en premier.
 * Combine taux d'erreur, ancienneté de la dernière révision, difficulté perçue et confiance.
 */
export function computePriorityScore(progress: ConceptProgress, now: Date = new Date()): number {
  const errorRate = progress.attempts === 0 ? 0.5 : 1 - progress.successRate
  const daysSinceReview = Math.max(
    0,
    (now.getTime() - new Date(progress.lastAttemptAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  const overdueDays = Math.max(
    0,
    (now.getTime() - new Date(progress.nextReviewAt).getTime()) / (1000 * 60 * 60 * 24),
  )

  const errorWeight = errorRate * 3
  const overdueWeight = Math.min(3, overdueDays / 2)
  const stalenessWeight = Math.min(1, daysSinceReview / 30)
  const difficultyWeight = (progress.difficultyAdjustment - 1) * 0.5
  const confidencePenalty = progress.confidence * 0.2

  return errorWeight + overdueWeight + stalenessWeight + difficultyWeight - confidencePenalty
}

export function isDueForReview(progress: ConceptProgress, now: Date = new Date()): boolean {
  return new Date(progress.nextReviewAt).getTime() <= now.getTime()
}
