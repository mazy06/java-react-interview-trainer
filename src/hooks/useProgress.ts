import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { ProgressState, QuestionProgress } from '../types/progress'
import type { Question } from '../types/question'
import type { QuestionAttempt, SessionResult } from '../types/session'
import { createConceptProgress, recordConceptAttempt } from '../lib/spacedRepetition'
import { isAttemptCorrect } from '../lib/scoring'

export const STORAGE_KEYS = {
  PROGRESS: 'jrit_progress_v1',
  SESSIONS: 'jrit_sessions_v1',
  CUSTOM_QUESTIONS: 'jrit_custom_questions_v1',
} as const

const EMPTY_PROGRESS: ProgressState = {
  concepts: {},
  questions: {},
  bestStreak: 0,
  currentStreak: 0,
}

function defaultQuestionProgress(questionId: string): QuestionProgress {
  return {
    questionId,
    favorite: false,
    reviewLater: false,
    reportedIssue: false,
    lastResult: null,
    attempts: 0,
  }
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>(
    STORAGE_KEYS.PROGRESS,
    EMPTY_PROGRESS,
  )
  const [sessions, setSessions] = useLocalStorage<SessionResult[]>(STORAGE_KEYS.SESSIONS, [])
  const [customQuestions, setCustomQuestions] = useLocalStorage<Question[]>(
    STORAGE_KEYS.CUSTOM_QUESTIONS,
    [],
  )

  const applyAttempt = useCallback(
    (question: Question, attempt: QuestionAttempt, now: Date = new Date()) => {
      setProgress((prev) => {
        const correct = isAttemptCorrect(attempt)
        const conceptExisting =
          prev.concepts[question.keyConcept] ?? createConceptProgress(question.keyConcept, now)
        const concept = recordConceptAttempt(
          conceptExisting,
          correct,
          question.reviewIntervals,
          now,
          attempt.selfRating,
        )

        const qExisting = prev.questions[question.id] ?? defaultQuestionProgress(question.id)
        const qProgress: QuestionProgress = {
          ...qExisting,
          attempts: qExisting.attempts + 1,
          lastResult: attempt.didNotKnow ? 'unknown' : correct ? 'correct' : 'incorrect',
          reviewLater: attempt.flaggedForReview || qExisting.reviewLater,
          reportedIssue: attempt.reportedIssue || qExisting.reportedIssue,
        }

        const currentStreak = correct ? prev.currentStreak + 1 : 0
        const bestStreak = Math.max(prev.bestStreak, currentStreak)

        return {
          concepts: { ...prev.concepts, [question.keyConcept]: concept },
          questions: { ...prev.questions, [question.id]: qProgress },
          bestStreak,
          currentStreak,
        }
      })
    },
    [setProgress],
  )

  const toggleFavorite = useCallback(
    (questionId: string) => {
      setProgress((prev) => {
        const existing = prev.questions[questionId] ?? defaultQuestionProgress(questionId)
        return {
          ...prev,
          questions: {
            ...prev.questions,
            [questionId]: { ...existing, favorite: !existing.favorite },
          },
        }
      })
    },
    [setProgress],
  )

  const toggleReviewLater = useCallback(
    (questionId: string) => {
      setProgress((prev) => {
        const existing = prev.questions[questionId] ?? defaultQuestionProgress(questionId)
        return {
          ...prev,
          questions: {
            ...prev.questions,
            [questionId]: { ...existing, reviewLater: !existing.reviewLater },
          },
        }
      })
    },
    [setProgress],
  )

  const markReported = useCallback(
    (questionId: string) => {
      setProgress((prev) => {
        const existing = prev.questions[questionId] ?? defaultQuestionProgress(questionId)
        return {
          ...prev,
          questions: { ...prev.questions, [questionId]: { ...existing, reportedIssue: true } },
        }
      })
    },
    [setProgress],
  )

  const recordSession = useCallback(
    (result: SessionResult) => {
      setSessions((prev) => [...prev, result])
    },
    [setSessions],
  )

  const resetProgress = useCallback(() => {
    setProgress(EMPTY_PROGRESS)
    setSessions([])
  }, [setProgress, setSessions])

  const importProgressData = useCallback(
    (data: { progress: ProgressState; sessions: SessionResult[] }) => {
      setProgress(data.progress)
      setSessions(data.sessions)
    },
    [setProgress, setSessions],
  )

  const addCustomQuestions = useCallback(
    (questions: Question[]) => {
      setCustomQuestions((prev) => [...prev, ...questions])
    },
    [setCustomQuestions],
  )

  const favoriteQuestionIds = useMemo(
    () =>
      new Set(
        Object.values(progress.questions)
          .filter((q) => q.favorite)
          .map((q) => q.questionId),
      ),
    [progress.questions],
  )

  return {
    progress,
    sessions,
    customQuestions,
    favoriteQuestionIds,
    applyAttempt,
    toggleFavorite,
    toggleReviewLater,
    markReported,
    recordSession,
    resetProgress,
    importProgressData,
    addCustomQuestions,
  }
}
