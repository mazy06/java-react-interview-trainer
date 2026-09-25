import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Download, Printer, Home } from 'lucide-react'
import questionsData from '../data/questions.json'
import type { Question } from '../types/question'
import type { SessionResult } from '../types/session'
import { useProgressContext } from '../hooks/ProgressContext'
import { computeThemeScores, isAttemptCorrect } from '../lib/scoring'
import { buildDailyPoints } from '../lib/statistics'
import {
  computeNextReviewRecommendation,
  downloadNodeAsPng,
  reportFilename,
} from '../lib/reportGenerator'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { computeInterviewCategoryScores } from '../lib/interviewScoring'
import { ReportView } from '../components/Results/ReportView'
import { InterviewScoreBreakdown } from '../components/Results/InterviewScoreBreakdown'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { AlertTriangle } from 'lucide-react'

const questions = questionsData as Question[]

export function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = (location.state as { result?: SessionResult } | null)?.result

  const { progress, sessions, customQuestions } = useProgressContext()
  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions])
  const questionsById = useMemo(() => new Map(allQuestions.map((q) => [q.id, q])), [allQuestions])
  const { weakestConcepts } = useSpacedRepetition(progress)
  const reportRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  if (!result) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={AlertTriangle}
          title="Aucun résultat à afficher"
          description="Terminez une session pour voir un rapport."
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate('/')}>Retour au tableau de bord</Button>
        </div>
      </div>
    )
  }

  const themeScores = computeThemeScores(result.attempts, questionsById)
  const successRatePercent =
    result.totalQuestions === 0 ? 0 : Math.round((result.score / result.totalQuestions) * 100)
  const recommendation = computeNextReviewRecommendation(successRatePercent)
  const dailyPoints = buildDailyPoints(sessions, 30)

  const previousSession = sessions
    .filter((s) => s.id !== result.id && s.finishedAt < result.finishedAt)
    .at(-1)
  const previousScorePercent = previousSession
    ? previousSession.totalQuestions === 0
      ? 0
      : Math.round((previousSession.score / previousSession.totalQuestions) * 100)
    : null

  const topConceptsToReview = weakestConcepts.filter((c) => c.successRate < 1).slice(0, 5)

  const incorrectQuestionLabels = result.attempts
    .filter((a) => !isAttemptCorrect(a))
    .map((a) => questionsById.get(a.questionId)?.question ?? a.questionId)

  const interviewScores =
    result.mode === 'interview'
      ? computeInterviewCategoryScores(result.attempts, questionsById)
      : []

  const handleDownload = async () => {
    if (!reportRef.current) return
    setDownloading(true)
    try {
      await downloadNodeAsPng(reportRef.current, reportFilename())
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Résultats de la session</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Imprimer / PDF
          </Button>
          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloading ? 'Génération…' : 'Télécharger le rapport PNG'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="h-4 w-4" aria-hidden="true" />
            Tableau de bord
          </Button>
        </div>
      </div>

      {result.mode === 'interview' && <InterviewScoreBreakdown scores={interviewScores} />}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <ReportView
          ref={reportRef}
          result={result}
          themeScores={themeScores}
          topConceptsToReview={topConceptsToReview}
          incorrectQuestionLabels={incorrectQuestionLabels}
          previousScorePercent={previousScorePercent}
          recommendation={recommendation}
          dailyPoints={dailyPoints}
        />
      </div>
    </div>
  )
}
