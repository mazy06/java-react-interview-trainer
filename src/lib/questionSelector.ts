import type { Question } from '../types/question'
import type { ProgressState } from '../types/progress'
import type { SessionConfig } from '../types/session'
import { computePriorityScore } from './spacedRepetition'

/** Poids de base attribué à un concept jamais vu, pour mélanger révision et nouveauté. */
const BASELINE_WEIGHT = 1.5

function matchesFilters(question: Question, config: SessionConfig): boolean {
  if (config.themes.length > 0 && !config.themes.includes(question.theme)) return false
  if (config.difficulty !== 'mixed' && question.difficulty !== config.difficulty) return false
  return true
}

function matchesMode(question: Question, config: SessionConfig, progress: ProgressState): boolean {
  const qProgress = progress.questions[question.id]
  switch (config.mode) {
    case 'favorites':
      return Boolean(qProgress?.favorite)
    case 'review-errors': {
      const conceptProgress = progress.concepts[question.keyConcept]
      const conceptStruggling = conceptProgress ? conceptProgress.successRate < 1 : false
      return Boolean(
        qProgress?.lastResult === 'incorrect' || qProgress?.reviewLater || conceptStruggling,
      )
    }
    default:
      return true
  }
}

function questionWeight(question: Question, progress: ProgressState, now: Date): number {
  const conceptProgress = progress.concepts[question.keyConcept]
  if (!conceptProgress) return BASELINE_WEIGHT
  const priority = computePriorityScore(conceptProgress, now)
  return Math.max(0.1, BASELINE_WEIGHT + priority)
}

function weightedSampleWithoutReplacement(
  items: { question: Question; weight: number }[],
  count: number,
  random: () => number,
): Question[] {
  const pool = [...items]
  const picked: Question[] = []

  while (pool.length > 0 && picked.length < count) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0)
    let threshold = random() * totalWeight
    let index = 0
    for (; index < pool.length; index++) {
      threshold -= pool[index].weight
      if (threshold <= 0) break
    }
    const chosenIndex = Math.min(index, pool.length - 1)
    picked.push(pool[chosenIndex].question)
    pool.splice(chosenIndex, 1)
  }

  return picked
}

export interface SelectQuestionsParams {
  questions: Question[]
  config: SessionConfig
  progress: ProgressState
  /** Questions déjà posées dans la session en cours, évitées en priorité. */
  excludeQuestionIds?: string[]
  now?: Date
  /** Générateur pseudo-aléatoire injectable pour des tests déterministes. */
  random?: () => number
}

export function selectSessionQuestions(params: SelectQuestionsParams): Question[] {
  const {
    questions,
    config,
    progress,
    excludeQuestionIds = [],
    now = new Date(),
    random = Math.random,
  } = params

  const excluded = new Set(excludeQuestionIds)
  const eligible = questions.filter(
    (q) => matchesFilters(q, config) && matchesMode(q, config, progress),
  )

  const fresh = eligible.filter((q) => !excluded.has(q.id))
  const pool = fresh.length >= config.questionCount ? fresh : eligible

  const weighted = pool.map((question) => ({
    question,
    weight: questionWeight(question, progress, now),
  }))

  return weightedSampleWithoutReplacement(weighted, config.questionCount, random)
}

export function shuffleOptions<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
