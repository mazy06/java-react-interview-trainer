import { useCallback, useMemo, useRef, useState } from 'react'
import type { Question } from '../types/question'
import type { QuestionAttempt, SelfRating, SessionConfig, SessionResult } from '../types/session'
import { computeSessionScore, isMcqAnswerCorrect } from '../lib/scoring'
import { nowIso } from '../lib/dateUtils'

export interface UseSessionApi {
  applyAttempt: (question: Question, attempt: QuestionAttempt) => void
  recordSession: (result: SessionResult) => void
}

export interface SubmitAnswerInput {
  selectedOptionIds?: string[]
  selfRating?: SelfRating | null
  didNotKnow?: boolean
  flaggedForReview?: boolean
  reportedIssue?: boolean
  understoodExplanation?: boolean | null
}

function makeSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useSession(questions: Question[], config: SessionConfig, api: UseSessionApi) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([])
  const [lastAttempt, setLastAttempt] = useState<QuestionAttempt | null>(null)
  const startedAtRef = useRef(nowIso())
  const questionStartRef = useRef(Date.now())

  const currentQuestion = questions[currentIndex] ?? null
  const isFinished = currentIndex >= questions.length

  const submitAnswer = useCallback(
    (input: SubmitAnswerInput) => {
      if (!currentQuestion) return
      const timeSpentMs = Date.now() - questionStartRef.current
      const isCorrect =
        currentQuestion.type === 'mcq' && input.selectedOptionIds
          ? isMcqAnswerCorrect(currentQuestion, input.selectedOptionIds)
          : null

      const attempt: QuestionAttempt = {
        questionId: currentQuestion.id,
        isCorrect,
        selectedOptionIds: input.selectedOptionIds ?? [],
        selfRating: input.selfRating ?? null,
        timeSpentMs,
        didNotKnow: input.didNotKnow ?? false,
        flaggedForReview: input.flaggedForReview ?? false,
        reportedIssue: input.reportedIssue ?? false,
        understoodExplanation: input.understoodExplanation ?? null,
      }

      api.applyAttempt(currentQuestion, attempt)
      setAttempts((prev) => [...prev, attempt])
      setLastAttempt(attempt)
    },
    [api, currentQuestion],
  )

  const goNext = useCallback(() => {
    questionStartRef.current = Date.now()
    setLastAttempt(null)
    setCurrentIndex((i) => i + 1)
  }, [])

  const finishSession = useCallback((): SessionResult => {
    const { score, totalQuestions } = computeSessionScore(attempts)
    const totalTimeMs = attempts.reduce((sum, a) => sum + a.timeSpentMs, 0)
    const result: SessionResult = {
      id: makeSessionId(),
      startedAt: startedAtRef.current,
      finishedAt: nowIso(),
      mode: config.mode,
      themes: config.themes,
      difficulty: config.difficulty,
      attempts,
      score,
      totalQuestions,
      totalTimeMs,
    }
    api.recordSession(result)
    return result
  }, [attempts, api, config])

  const progressPercent = useMemo(
    () => (questions.length === 0 ? 0 : Math.round((currentIndex / questions.length) * 100)),
    [currentIndex, questions.length],
  )

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    progressPercent,
    attempts,
    lastAttempt,
    isFinished,
    submitAnswer,
    goNext,
    finishSession,
  }
}
