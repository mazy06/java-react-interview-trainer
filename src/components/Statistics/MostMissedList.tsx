import type { Question } from '../../types/question'
import { EmptyState } from '../ui/EmptyState'
import { AlertOctagon } from 'lucide-react'

interface MostMissedListProps {
  entries: { questionId: string; misses: number }[]
  questionsById: Map<string, Question>
}

export function MostMissedList({ entries, questionsById }: MostMissedListProps) {
  if (entries.length === 0) {
    return <EmptyState icon={AlertOctagon} title="Aucune question ratée à afficher" />
  }

  return (
    <ol className="space-y-2 text-sm">
      {entries.map((entry) => {
        const question = questionsById.get(entry.questionId)
        return (
          <li
            key={entry.questionId}
            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
          >
            <span className="text-slate-700">{question?.question ?? entry.questionId}</span>
            <span className="shrink-0 tabular-nums font-semibold text-red-600">
              {entry.misses}×
            </span>
          </li>
        )
      })}
    </ol>
  )
}
