import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import questionsData from '../data/questions.json'
import type { Question } from '../types/question'
import type { SessionConfig } from '../types/session'
import { useProgressContext } from '../hooks/ProgressContext'
import { useQuestionSelection } from '../hooks/useQuestionSelection'
import { useSession } from '../hooks/useSession'
import { QuestionCard } from '../components/QuestionCard/QuestionCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { AlertTriangle } from 'lucide-react'

const questions = questionsData as Question[]

export function SessionPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const config = (location.state as { config?: SessionConfig } | null)?.config

  const {
    progress,
    customQuestions,
    applyAttempt,
    recordSession,
    toggleFavorite,
    favoriteQuestionIds,
  } = useProgressContext()
  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions])

  if (!config) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={AlertTriangle}
          title="Aucune configuration de session"
          description="Revenez à l'écran de configuration pour démarrer une nouvelle session."
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate('/session/new')}>Configurer une session</Button>
        </div>
      </div>
    )
  }

  return (
    <SessionRunner
      config={config}
      allQuestions={allQuestions}
      progress={progress}
      applyAttempt={applyAttempt}
      recordSession={recordSession}
      toggleFavorite={toggleFavorite}
      favoriteQuestionIds={favoriteQuestionIds}
    />
  )
}

interface SessionRunnerProps {
  config: SessionConfig
  allQuestions: Question[]
  progress: ReturnType<typeof useProgressContext>['progress']
  applyAttempt: ReturnType<typeof useProgressContext>['applyAttempt']
  recordSession: ReturnType<typeof useProgressContext>['recordSession']
  toggleFavorite: ReturnType<typeof useProgressContext>['toggleFavorite']
  favoriteQuestionIds: Set<string>
}

function SessionRunner({
  config,
  allQuestions,
  progress,
  applyAttempt,
  recordSession,
  toggleFavorite,
  favoriteQuestionIds,
}: SessionRunnerProps) {
  const navigate = useNavigate()
  const questionsForSession = useQuestionSelection(allQuestions, config, progress)
  const session = useSession(questionsForSession, config, { applyAttempt, recordSession })
  const hasFinishedRef = useRef(false)

  useEffect(() => {
    if (!session.isFinished || hasFinishedRef.current) return
    hasFinishedRef.current = true
    const result = session.finishSession()
    navigate('/session/results', { state: { result }, replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isFinished])

  if (questionsForSession.length === 0) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={AlertTriangle}
          title="Aucune question ne correspond à ces filtres"
          description="Essayez d'élargir les thèmes ou la difficulté sélectionnés."
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate('/session/new')}>Changer les filtres</Button>
        </div>
      </div>
    )
  }

  if (session.isFinished) return null

  const question = session.currentQuestion
  if (!question) return null

  const handleNext = () => session.goNext()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <ProgressBar
        value={session.currentIndex}
        max={session.totalQuestions}
        label="Progression de la session"
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <QuestionCard
          question={question}
          questionNumber={session.currentIndex + 1}
          totalQuestions={session.totalQuestions}
          showInstantCorrection={config.instantCorrection}
          timerEnabled={config.timerEnabled}
          shuffleAnswers={config.shuffleOptions}
          favorite={favoriteQuestionIds.has(question.id)}
          onToggleFavorite={() => toggleFavorite(question.id)}
          onSubmit={session.submitAnswer}
          onNext={handleNext}
          isLastQuestion={session.currentIndex + 1 >= questionsForSession.length}
        />
      </div>
    </div>
  )
}
