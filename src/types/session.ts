import type { Difficulty, Theme } from './question'

export type SessionMode = 'training' | 'exam' | 'review-errors' | 'favorites' | 'interview'

export interface SessionConfig {
  questionCount: number
  themes: Theme[]
  difficulty: Difficulty | 'mixed'
  mode: SessionMode
  timerEnabled: boolean
  instantCorrection: boolean
  shuffleOptions: boolean
  interviewDurationMinutes?: 30 | 45 | 60 | 90
}

export type SelfRating = 0 | 1 | 2 | 3 | 4

export interface QuestionAttempt {
  questionId: string
  isCorrect: boolean | null
  selectedOptionIds: string[]
  selfRating: SelfRating | null
  timeSpentMs: number
  didNotKnow: boolean
  flaggedForReview: boolean
  reportedIssue: boolean
  understoodExplanation: boolean | null
}

export interface SessionResult {
  id: string
  startedAt: string
  finishedAt: string
  mode: SessionMode
  themes: Theme[]
  difficulty: Difficulty | 'mixed'
  attempts: QuestionAttempt[]
  score: number
  totalQuestions: number
  totalTimeMs: number
}
