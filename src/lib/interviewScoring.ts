import type { Question } from '../types/question'
import type { QuestionAttempt } from '../types/session'
import { isAttemptCorrect } from './scoring'

export type InterviewCategory =
  | 'connaissances'
  | 'raisonnement'
  | 'diagnostic'
  | 'securite'
  | 'tests'
  | 'communication'
  | 'limites'

const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  connaissances: 'Connaissances',
  raisonnement: 'Raisonnement',
  diagnostic: 'Diagnostic',
  securite: 'Sécurité',
  tests: 'Qualité des tests',
  communication: 'Communication',
  limites: 'Capacité à reconnaître une limite',
}

export { CATEGORY_LABELS }

function categoryFor(question: Question, attempt: QuestionAttempt): InterviewCategory {
  if (attempt.didNotKnow) return 'limites'
  if (question.theme === 'Entretien comportemental') return 'communication'
  if (question.proofType === 'security') return 'securite'
  if (question.proofType === 'testing') return 'tests'
  if (question.proofType === 'diagnosis') return 'diagnostic'
  if (question.proofType === 'tradeoff') return 'raisonnement'
  return 'connaissances'
}

export interface InterviewCategoryScore {
  category: InterviewCategory
  label: string
  attempts: number
  correct: number
  successRate: number
}

export function computeInterviewCategoryScores(
  attempts: QuestionAttempt[],
  questionsById: Map<string, Question>,
): InterviewCategoryScore[] {
  const buckets = new Map<InterviewCategory, { attempts: number; correct: number }>()

  for (const attempt of attempts) {
    const question = questionsById.get(attempt.questionId)
    if (!question) continue
    const category = categoryFor(question, attempt)
    const bucket = buckets.get(category) ?? { attempts: 0, correct: 0 }
    bucket.attempts += 1
    if (category === 'limites' ? attempt.didNotKnow : isAttemptCorrect(attempt)) bucket.correct += 1
    buckets.set(category, bucket)
  }

  return Array.from(buckets.entries()).map(([category, bucket]) => ({
    category,
    label: CATEGORY_LABELS[category],
    attempts: bucket.attempts,
    correct: bucket.correct,
    successRate: bucket.attempts === 0 ? 0 : bucket.correct / bucket.attempts,
  }))
}
