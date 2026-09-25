import type { Question } from '../types/question'
import type { QuestionAttempt, SelfRating } from '../types/session'
import type { DifficultyScore, ThemeScore } from '../types/statistics'

/** Seuil au-delà duquel une auto-évaluation (question ouverte/code) compte comme réussie. */
const SELF_RATING_SUCCESS_THRESHOLD: SelfRating = 3

export function isMcqAnswerCorrect(question: Question, selectedOptionIds: string[]): boolean {
  if (question.type !== 'mcq') return false
  if (selectedOptionIds.length !== question.correctOptionIds.length) return false
  const correct = new Set(question.correctOptionIds)
  return selectedOptionIds.every((id) => correct.has(id))
}

export function isAttemptCorrect(attempt: QuestionAttempt): boolean {
  if (attempt.didNotKnow) return false
  if (attempt.isCorrect !== null) return attempt.isCorrect
  if (attempt.selfRating !== null) return attempt.selfRating >= SELF_RATING_SUCCESS_THRESHOLD
  return false
}

export function computeSessionScore(attempts: QuestionAttempt[]): {
  score: number
  totalQuestions: number
  successRatePercent: number
} {
  const totalQuestions = attempts.length
  const score = attempts.filter(isAttemptCorrect).length
  const successRatePercent = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100)
  return { score, totalQuestions, successRatePercent }
}

export function computeThemeScores(
  attempts: QuestionAttempt[],
  questionsById: Map<string, Question>,
): ThemeScore[] {
  const byTheme = new Map<string, { attempts: number; correct: number }>()

  for (const attempt of attempts) {
    const question = questionsById.get(attempt.questionId)
    if (!question) continue
    const bucket = byTheme.get(question.theme) ?? { attempts: 0, correct: 0 }
    bucket.attempts += 1
    if (isAttemptCorrect(attempt)) bucket.correct += 1
    byTheme.set(question.theme, bucket)
  }

  return Array.from(byTheme.entries()).map(([theme, bucket]) => ({
    theme: theme as ThemeScore['theme'],
    attempts: bucket.attempts,
    correct: bucket.correct,
    successRate: bucket.attempts === 0 ? 0 : bucket.correct / bucket.attempts,
  }))
}

export function computeDifficultyScores(
  attempts: QuestionAttempt[],
  questionsById: Map<string, Question>,
): DifficultyScore[] {
  const byDifficulty = new Map<string, { attempts: number; correct: number }>()

  for (const attempt of attempts) {
    const question = questionsById.get(attempt.questionId)
    if (!question) continue
    const bucket = byDifficulty.get(question.difficulty) ?? { attempts: 0, correct: 0 }
    bucket.attempts += 1
    if (isAttemptCorrect(attempt)) bucket.correct += 1
    byDifficulty.set(question.difficulty, bucket)
  }

  return Array.from(byDifficulty.entries()).map(([difficulty, bucket]) => ({
    difficulty: difficulty as DifficultyScore['difficulty'],
    attempts: bucket.attempts,
    correct: bucket.correct,
    successRate: bucket.attempts === 0 ? 0 : bucket.correct / bucket.attempts,
  }))
}

export function computeAverageTimeMs(attempts: QuestionAttempt[]): number {
  if (attempts.length === 0) return 0
  const total = attempts.reduce((sum, a) => sum + a.timeSpentMs, 0)
  return Math.round(total / attempts.length)
}
