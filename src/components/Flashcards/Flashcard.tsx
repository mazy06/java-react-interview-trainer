import { useState } from 'react'

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      aria-live="polite"
      className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200
        bg-white p-8 text-center shadow-sm transition-colors duration-200 ease-out hover:bg-slate-50
        motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-brand-600"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {revealed ? 'Réponse' : 'Question — cliquer pour révéler'}
      </p>
      <p className="text-lg font-medium text-slate-900">{revealed ? back : front}</p>
    </button>
  )
}
