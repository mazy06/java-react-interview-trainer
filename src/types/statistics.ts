import type { Difficulty, Theme } from './question'
import type { SessionResult } from './session'

export interface ThemeScore {
  theme: Theme
  attempts: number
  correct: number
  successRate: number
}

export interface DifficultyScore {
  difficulty: Difficulty
  attempts: number
  correct: number
  successRate: number
}

export interface DailyPoint {
  date: string
  attempts: number
  correct: number
  successRate: number
}

export interface AppStatistics {
  sessions: SessionResult[]
  totalQuestionsAnswered: number
  totalCorrect: number
  averageScore: number
  globalSuccessRate: number
  firstAttemptSuccessRate: number
  successRateAfterRepetition: number
  averageTimePerQuestionMs: number
  themeScores: ThemeScore[]
  difficultyScores: DifficultyScore[]
  mostMissedQuestionIds: { questionId: string; misses: number }[]
  dailyPoints: DailyPoint[]
}
