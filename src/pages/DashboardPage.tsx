import { useMemo } from 'react'
import { ListChecks, Trophy, Percent, Flame } from 'lucide-react'
import questionsData from '../data/questions.json'
import type { Question } from '../types/question'
import { useProgressContext } from '../hooks/ProgressContext'
import { buildAppStatistics } from '../lib/statistics'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { StatTile } from '../components/Dashboard/StatTile'
import { WeakConceptsList } from '../components/Dashboard/WeakConceptsList'
import { ThemeProgressList } from '../components/Dashboard/ThemeProgressList'
import { QuickActions } from '../components/Dashboard/QuickActions'

const questions = questionsData as Question[]

export function DashboardPage() {
  const { progress, sessions, customQuestions } = useProgressContext()
  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions])
  const stats = useMemo(() => buildAppStatistics(sessions, allQuestions), [sessions, allQuestions])
  const { weakestConcepts } = useSpacedRepetition(progress)

  const strugglingConcepts = weakestConcepts.filter((c) => c.successRate < 0.8).slice(0, 5)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Entraînement Java + React</h1>
        <p className="mt-1 text-sm text-slate-600">
          {allQuestions.length} questions disponibles · {sessions.length} session
          {sessions.length > 1 ? 's' : ''} terminée{sessions.length > 1 ? 's' : ''}
        </p>
      </header>

      <section aria-label="Statistiques clés" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile icon={ListChecks} label="Questions" value={String(allQuestions.length)} />
        <StatTile icon={Trophy} label="Sessions terminées" value={String(sessions.length)} />
        <StatTile
          icon={Percent}
          label="Taux de réussite"
          value={`${Math.round(stats.globalSuccessRate * 100)}%`}
        />
        <StatTile icon={Flame} label="Meilleure série" value={String(progress.bestStreak)} />
      </section>

      <section aria-label="Actions rapides">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Actions rapides
        </h2>
        <QuickActions />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <WeakConceptsList concepts={strugglingConcepts} />
        <ThemeProgressList themeScores={stats.themeScores} />
      </section>
    </div>
  )
}
