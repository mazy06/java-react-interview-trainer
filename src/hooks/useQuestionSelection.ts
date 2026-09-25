import { useState } from 'react'
import type { Question } from '../types/question'
import type { ProgressState } from '../types/progress'
import type { SessionConfig } from '../types/session'
import { selectSessionQuestions } from '../lib/questionSelector'

/**
 * Sélectionne les questions d'une session une seule fois, au montage.
 * La progression évolue pendant la session (chaque réponse la met à jour) ;
 * si on recalculait à chaque changement, la liste de questions se
 * réorganiserait sous les pieds de l'utilisateur en pleine session.
 */
export function useQuestionSelection(
  questions: Question[],
  config: SessionConfig,
  progress: ProgressState,
  excludeQuestionIds: string[] = [],
): Question[] {
  const [selected] = useState<Question[]>(() =>
    selectSessionQuestions({ questions, config, progress, excludeQuestionIds }),
  )
  return selected
}
