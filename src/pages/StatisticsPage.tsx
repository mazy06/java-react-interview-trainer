import { useMemo, useState } from 'react'
import { Percent, RotateCcw, Clock3, ListChecks } from 'lucide-react'
import questionsData from '../data/questions.json'
import type { Question } from '../types/question'
import { useProgressContext } from '../hooks/ProgressContext'
import { buildAppStatistics, buildDailyPoints } from '../lib/statistics'
import { formatDuration } from '../lib/dateUtils'
import { StatTile } from '../components/Dashboard/StatTile'
import { ThemeProgressList } from '../components/Dashboard/ThemeProgressList'
import { ProgressChart } from '../components/Results/ProgressChart'
import { SessionHistoryTable } from '../components/Statistics/SessionHistoryTable'
import { MostMissedList } from '../components/Statistics/MostMissedList'
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card'

const questions = questionsData as Question[]
const RANGE_OPTIONS = [7, 14, 30] as const

export function StatisticsPage() {
  const { sessions, customQuestions } = useProgressContext()
  const [rangeDays, setRangeDays] = useState<(typeof RANGE_OPTIONS)[number]>(30)

  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions])
  const questionsById = useMemo(() => new Map(allQuestions.map((q) => [q.id, q])), [allQuestions])
  const stats = useMemo(() => buildAppStatistics(sessions, allQuestions), [sessions, allQuestions])
  const dailyPoints = useMemo(() => buildDailyPoints(sessions, rangeDays), [sessions, rangeDays])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Statistiques</h1>
        <p className="mt-1 text-sm text-slate-600">Vue d'ensemble de votre progression.</p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          icon={ListChecks}
          label="Questions répondues"
          value={String(stats.totalQuestionsAnswered)}
        />
        <StatTile
          icon={Percent}
          label="Réussite globale"
          value={`${Math.round(stats.globalSuccessRate * 100)}%`}
        />
        <StatTile
          icon={RotateCcw}
          label="Réussite après répétition"
          value={`${Math.round(stats.successRateAfterRepetition * 100)}%`}
        />
        <StatTile
          icon={Clock3}
          label="Temps moyen / question"
          value={formatDuration(stats.averageTimePerQuestionMs)}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Évolution de la réussite</CardTitle>
          <div className="flex gap-1" role="group" aria-label="Période affichée">
            {RANGE_OPTIONS.map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={rangeDays === days}
                onClick={() => setRangeDays(days)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ease-out
                  motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-brand-600
                  ${rangeDays === days ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {days} jours
              </button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          <ProgressChart points={dailyPoints} />
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ThemeProgressList themeScores={stats.themeScores} />
        <Card>
          <CardHeader>
            <CardTitle>Questions les plus souvent ratées</CardTitle>
          </CardHeader>
          <CardBody>
            <MostMissedList entries={stats.mostMissedQuestionIds} questionsById={questionsById} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score par difficulté</CardTitle>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.difficultyScores.map((d) => (
            <div key={d.difficulty} className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">{d.difficulty}</p>
              <p className="text-xl font-semibold tabular-nums text-slate-900">
                {Math.round(d.successRate * 100)}%
              </p>
              <p className="text-xs text-slate-500">{d.attempts} réponses</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des sessions</CardTitle>
        </CardHeader>
        <CardBody>
          <SessionHistoryTable sessions={sessions} />
        </CardBody>
      </Card>
    </div>
  )
}
