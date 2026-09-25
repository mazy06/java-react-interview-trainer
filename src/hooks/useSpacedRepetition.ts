import { useMemo } from 'react'
import type { ProgressState } from '../types/progress'
import { computePriorityScore, isDueForReview } from '../lib/spacedRepetition'

export function useSpacedRepetition(progress: ProgressState, now: Date = new Date()) {
  const dueConceptIds = useMemo(
    () =>
      Object.values(progress.concepts)
        .filter((c) => isDueForReview(c, now))
        .map((c) => c.conceptId),
    [progress.concepts, now],
  )

  const weakestConcepts = useMemo(() => {
    return Object.values(progress.concepts)
      .map((c) => ({
        conceptId: c.conceptId,
        priority: computePriorityScore(c, now),
        successRate: c.successRate,
      }))
      .sort((a, b) => b.priority - a.priority)
  }, [progress.concepts, now])

  return { dueConceptIds, weakestConcepts }
}
