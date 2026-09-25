import { useNavigate } from 'react-router-dom'
import { InterviewSetup } from '../components/InterviewMode/InterviewSetup'
import type { SessionConfig } from '../types/session'

export function InterviewPage() {
  const navigate = useNavigate()

  const handleStart = (duration: 30 | 45 | 60 | 90, questionCount: number) => {
    const config: SessionConfig = {
      questionCount,
      themes: [],
      difficulty: 'mixed',
      mode: 'interview',
      timerEnabled: true,
      instantCorrection: true,
      shuffleOptions: true,
      interviewDurationMinutes: duration,
    }
    navigate('/session/play', { state: { config } })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Simulation d'entretien</h1>
        <p className="mt-1 text-sm text-slate-600">
          Un mélange de questions techniques et comportementales, chronométré, avec un score
          détaillé en fin de simulation.
        </p>
      </header>
      <InterviewSetup onStart={handleStart} />
    </div>
  )
}
