import { useState } from 'react'
import type { Difficulty, Theme } from '../../types/question'
import type { SessionConfig, SessionMode } from '../../types/session'
import { Select } from '../ui/Select'
import { Switch } from '../ui/Switch'
import { Button } from '../ui/Button'

const ALL_THEMES: Theme[] = [
  'Java',
  'Spring',
  'JPA/Hibernate',
  'SQL',
  'JavaScript',
  'TypeScript',
  'React',
  'Tests',
  'Maven',
  'Git/GitLab',
  'Docker',
  'Architecture',
  'Sécurité',
  'Angular/RxJS',
  'RAG',
  'Entretien comportemental',
]

const QUESTION_COUNTS = [5, 10, 20, 30, 50]

const DIFFICULTY_OPTIONS: { value: Difficulty | 'mixed'; label: string }[] = [
  { value: 'mixed', label: 'Mélange' },
  { value: 'junior', label: 'Junior' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'advanced', label: 'Approfondissement' },
]

const MODE_OPTIONS: { value: SessionMode; label: string }[] = [
  { value: 'training', label: 'Entraînement' },
  { value: 'exam', label: 'Examen' },
  { value: 'review-errors', label: 'Révision des erreurs' },
  { value: 'favorites', label: 'Questions favorites' },
]

interface SessionSetupFormProps {
  initialMode?: SessionMode
  onStart: (config: SessionConfig) => void
}

export function SessionSetupForm({ initialMode = 'training', onStart }: SessionSetupFormProps) {
  const [questionCount, setQuestionCount] = useState(10)
  const [themes, setThemes] = useState<Theme[]>([])
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('mixed')
  const [mode, setMode] = useState<SessionMode>(initialMode)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [instantCorrection, setInstantCorrection] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(true)

  const toggleTheme = (theme: Theme) => {
    setThemes((prev) => (prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStart({
      questionCount,
      themes,
      difficulty,
      mode,
      timerEnabled,
      instantCorrection: mode === 'exam' ? false : instantCorrection,
      shuffleOptions,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Configuration de la session">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Nombre de questions"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        >
          {QUESTION_COUNTS.map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
        </Select>

        <Select
          label="Difficulté"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | 'mixed')}
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select label="Mode" value={mode} onChange={(e) => setMode(e.target.value as SessionMode)}>
          {MODE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">
          Thèmes{' '}
          {themes.length === 0 && (
            <span className="font-normal text-slate-400">(tous par défaut)</span>
          )}
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALL_THEMES.map((theme) => {
            const active = themes.includes(theme)
            return (
              <button
                key={theme}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTheme(theme)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out
                  motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-brand-600
                  ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {theme}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-1 rounded-xl border border-slate-200 p-4">
        <Switch checked={timerEnabled} onChange={setTimerEnabled} label="Chronomètre activé" />
        {mode !== 'exam' && (
          <Switch
            checked={instantCorrection}
            onChange={setInstantCorrection}
            label="Affichage immédiat de la correction"
          />
        )}
        <Switch
          checked={shuffleOptions}
          onChange={setShuffleOptions}
          label="Mélanger les réponses"
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Démarrer la session
      </Button>
    </form>
  )
}
