import type { SessionResult } from '../../types/session'
import { formatDateTimeFr, formatDuration } from '../../lib/dateUtils'
import { EmptyState } from '../ui/EmptyState'
import { History } from 'lucide-react'

const MODE_LABELS: Record<SessionResult['mode'], string> = {
  training: 'Entraînement',
  exam: 'Examen',
  'review-errors': 'Révision des erreurs',
  favorites: 'Favoris',
  interview: 'Entretien',
}

export function SessionHistoryTable({ sessions }: { sessions: SessionResult[] }) {
  if (sessions.length === 0) {
    return <EmptyState icon={History} title="Aucune session dans l'historique" />
  }

  const sorted = [...sessions].sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Historique des sessions terminées</caption>
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="py-2 pr-4">
              Date
            </th>
            <th scope="col" className="py-2 pr-4">
              Mode
            </th>
            <th scope="col" className="py-2 pr-4">
              Score
            </th>
            <th scope="col" className="py-2 pr-4">
              Durée
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.id} className="border-b border-slate-100">
              <td className="py-2 pr-4 text-slate-700">{formatDateTimeFr(s.finishedAt)}</td>
              <td className="py-2 pr-4 text-slate-700">{MODE_LABELS[s.mode]}</td>
              <td className="py-2 pr-4 tabular-nums font-medium text-slate-900">
                {s.score} / {s.totalQuestions}
              </td>
              <td className="py-2 pr-4 tabular-nums text-slate-700">
                {formatDuration(s.totalTimeMs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
