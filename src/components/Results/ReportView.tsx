import { forwardRef } from 'react'
import type { SessionResult } from '../../types/session'
import type { ThemeScore } from '../../types/statistics'
import { formatDateTimeFr, formatDuration } from '../../lib/dateUtils'
import { NEXT_REVIEW_LABELS, type NextReviewRecommendation } from '../../lib/reportGenerator'
import { ThemeBreakdownChart } from './ThemeBreakdownChart'
import { ProgressChart } from './ProgressChart'
import type { DailyPoint } from '../../types/statistics'

const MODE_LABELS: Record<SessionResult['mode'], string> = {
  training: 'Entraînement',
  exam: 'Examen',
  'review-errors': 'Révision des erreurs',
  favorites: 'Questions favorites',
  interview: "Simulation d'entretien",
}

interface ReportViewProps {
  result: SessionResult
  themeScores: ThemeScore[]
  topConceptsToReview: { conceptId: string; successRate: number }[]
  incorrectQuestionLabels: string[]
  previousScorePercent: number | null
  recommendation: NextReviewRecommendation
  dailyPoints: DailyPoint[]
}

export const ReportView = forwardRef<HTMLDivElement, ReportViewProps>(function ReportView(
  {
    result,
    themeScores,
    topConceptsToReview,
    incorrectQuestionLabels,
    previousScorePercent,
    recommendation,
    dailyPoints,
  },
  ref,
) {
  const successRatePercent =
    result.totalQuestions === 0 ? 0 : Math.round((result.score / result.totalQuestions) * 100)
  const averageTimeMs =
    result.attempts.length === 0 ? 0 : result.totalTimeMs / result.attempts.length
  const delta = previousScorePercent === null ? null : successRatePercent - previousScorePercent

  return (
    <div
      ref={ref}
      className="w-[800px] bg-white p-8 text-slate-900"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <h1 className="text-2xl font-bold text-brand-700">Rapport d'entraînement Java + React</h1>
      <p className="mt-1 text-sm text-slate-500">{formatDateTimeFr(result.finishedAt)}</p>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <ReportStat label="Mode" value={MODE_LABELS[result.mode]} />
        <ReportStat label="Questions" value={String(result.totalQuestions)} />
        <ReportStat label="Score" value={`${result.score} / ${result.totalQuestions}`} />
        <ReportStat label="Réussite" value={`${successRatePercent}%`} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <ReportStat label="Temps total" value={formatDuration(result.totalTimeMs)} />
        <ReportStat label="Temps moyen / question" value={formatDuration(averageTimeMs)} />
      </div>

      {delta !== null && (
        <p className="mt-4 text-sm font-medium text-slate-700">
          Progression par rapport à la session précédente :{' '}
          <span className={delta >= 0 ? 'text-emerald-600' : 'text-red-600'}>
            {delta >= 0 ? '+' : ''}
            {delta} points
          </span>
        </p>
      )}

      <p className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
        {NEXT_REVIEW_LABELS[recommendation]}
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Résultats par thème
        </h2>
        <ThemeBreakdownChart themeScores={themeScores} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Progression (30 derniers jours)
        </h2>
        <ProgressChart points={dailyPoints} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Top concepts à revoir
        </h2>
        {topConceptsToReview.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun concept prioritaire identifié pour l'instant.
          </p>
        ) : (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {topConceptsToReview.map((c) => (
              <li key={c.conceptId}>
                {c.conceptId} — {Math.round(c.successRate * 100)}% de réussite
              </li>
            ))}
          </ul>
        )}
      </section>

      {incorrectQuestionLabels.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Questions incorrectes
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {incorrectQuestionLabels.map((label, i) => (
              <li key={i}>{label}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs text-slate-400">
        Généré localement, aucune donnée n'a quitté votre navigateur.
      </p>
    </div>
  )
})

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  )
}
