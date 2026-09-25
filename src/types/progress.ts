export interface ConceptProgress {
  conceptId: string
  attempts: number
  correctAnswers: number
  wrongAnswers: number
  successRate: number
  lastAttemptAt: string
  nextReviewAt: string
  confidence: number
  streak: number
  difficultyAdjustment: number
}

export interface QuestionProgress {
  questionId: string
  favorite: boolean
  reviewLater: boolean
  reportedIssue: boolean
  lastResult: 'correct' | 'incorrect' | 'unknown' | null
  attempts: number
}

export interface ProgressState {
  concepts: Record<string, ConceptProgress>
  questions: Record<string, QuestionProgress>
  bestStreak: number
  currentStreak: number
}
