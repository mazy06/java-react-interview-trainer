import { useSearchParams, useNavigate } from 'react-router-dom'
import { SessionSetupForm } from '../components/SessionSetup/SessionSetupForm'
import type { SessionConfig, SessionMode } from '../types/session'

const VALID_MODES: SessionMode[] = ['training', 'exam', 'review-errors', 'favorites', 'interview']

export function SessionSetupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const modeParam = searchParams.get('mode')
  const initialMode = VALID_MODES.includes(modeParam as SessionMode)
    ? (modeParam as SessionMode)
    : 'training'

  const handleStart = (config: SessionConfig) => {
    navigate('/session/play', { state: { config } })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Nouvelle session</h1>
        <p className="mt-1 text-sm text-slate-600">
          Choisissez le périmètre de votre entraînement.
        </p>
      </header>
      <SessionSetupForm
        initialMode={initialMode === 'interview' ? 'training' : initialMode}
        onStart={handleStart}
      />
    </div>
  )
}
