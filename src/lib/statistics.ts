import type { Question } from '../types/question'
import type { SessionResult, QuestionAttempt } from '../types/session'
import type { AppStatistics, DailyPoint } from '../types/statistics'
import {
  computeAverageTimeMs,
  computeDifficultyScores,
  computeThemeScores,
  isAttemptCorrect,
} from './scoring'

function allAttempts(sessions: SessionResult[]): QuestionAttempt[] {
  return sessions.flatMap((s) => s.attempts)
}

function dayKey(iso: string): string {
  return iso.slice(0, 10)
}

export function buildDailyPoints(sessions: SessionResult[], days: number): DailyPoint[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const buckets = new Map<string, { attempts: number; correct: number }>()

  for (const session of sessions) {
    if (new Date(session.finishedAt).getTime() < cutoff) continue
    const key = dayKey(session.finishedAt)
    const bucket = buckets.get(key) ?? { attempts: 0, correct: 0 }
    bucket.attempts += session.attempts.length
    bucket.correct += session.attempts.filter(isAttemptCorrect).length
    buckets.set(key, bucket)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, bucket]) => ({
      date,
      attempts: bucket.attempts,
      correct: bucket.correct,
      successRate: bucket.attempts === 0 ? 0 : bucket.correct / bucket.attempts,
    }))
}

export function buildAppStatistics(
  sessions: SessionResult[],
  questions: Question[],
): AppStatistics {
  const questionsById = new Map(questions.map((q) => [q.id, q]))
  const attempts = allAttempts(sessions)

  const totalQuestionsAnswered = attempts.length
  const totalCorrect = attempts.filter(isAttemptCorrect).length
  const globalSuccessRate = totalQuestionsAnswered === 0 ? 0 : totalCorrect / totalQuestionsAnswered
  const averageScore =
    sessions.length === 0 ? 0 : sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length

  const firstAttemptByQuestion = new Map<string, boolean>()
  const laterAttempts: QuestionAttempt[] = []
  for (const attempt of attempts) {
    if (!firstAttemptByQuestion.has(attempt.questionId)) {
      firstAttemptByQuestion.set(attempt.questionId, isAttemptCorrect(attempt))
    } else {
      laterAttempts.push(attempt)
    }
  }
  const firstAttempts = Array.from(firstAttemptByQuestion.values())
  const firstAttemptSuccessRate =
    firstAttempts.length === 0 ? 0 : firstAttempts.filter(Boolean).length / firstAttempts.length
  const successRateAfterRepetition =
    laterAttempts.length === 0
      ? 0
      : laterAttempts.filter(isAttemptCorrect).length / laterAttempts.length

  const missCounts = new Map<string, number>()
  for (const attempt of attempts) {
    if (!isAttemptCorrect(attempt)) {
      missCounts.set(attempt.questionId, (missCounts.get(attempt.questionId) ?? 0) + 1)
    }
  }
  const mostMissedQuestionIds = Array.from(missCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([questionId, misses]) => ({ questionId, misses }))

  return {
    sessions,
    totalQuestionsAnswered,
    totalCorrect,
    averageScore,
    globalSuccessRate,
    firstAttemptSuccessRate,
    successRateAfterRepetition,
    averageTimePerQuestionMs: computeAverageTimeMs(attempts),
    themeScores: computeThemeScores(attempts, questionsById),
    difficultyScores: computeDifficultyScores(attempts, questionsById),
    mostMissedQuestionIds,
    dailyPoints: buildDailyPoints(sessions, 30),
  }
}
