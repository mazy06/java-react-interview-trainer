import type { SelfRating } from '../../types/session'

const LEVELS: { value: SelfRating; label: string }[] = [
  { value: 0, label: 'Inconnu' },
  { value: 1, label: 'Définition partielle' },
  { value: 2, label: 'Exemple compris' },
  { value: 3, label: 'Code et pièges maîtrisés' },
  { value: 4, label: 'Diagnostic et arbitrage maîtrisés' },
]

interface SelfRatingInputProps {
  value: SelfRating | null
  onChange: (value: SelfRating) => void
}

export function SelfRatingInput({ value, onChange }: SelfRatingInputProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">Auto-évaluation</legend>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((level) => {
          const active = value === level.value
          return (
            <button
              key={level.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(level.value)}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors duration-200
                ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-brand-600
                ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <span className="block font-semibold tabular-nums">{level.value}</span>
              {level.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
