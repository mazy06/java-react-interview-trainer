import { useMemo, useState } from 'react'
import { ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react'
import flashcardsData from '../data/flashcards.json'
import type { Theme } from '../types/question'
import { Flashcard } from '../components/Flashcards/Flashcard'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Layers } from 'lucide-react'

interface FlashcardEntry {
  id: string
  theme: Theme
  front: string
  back: string
  relatedQuestionIds: string[]
}

const flashcards = flashcardsData as FlashcardEntry[]
const THEMES = Array.from(new Set(flashcards.map((f) => f.theme))).sort()

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function FlashcardsPage() {
  const [themeFilter, setThemeFilter] = useState<string>('all')
  const [order, setOrder] = useState<FlashcardEntry[]>(() => shuffle(flashcards))
  const [index, setIndex] = useState(0)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)

  const filtered = useMemo(
    () => order.filter((f) => themeFilter === 'all' || f.theme === themeFilter),
    [order, themeFilter],
  )
  const current = filtered[index % Math.max(filtered.length, 1)]

  const handleAnswer = (isKnown: boolean) => {
    if (isKnown) setKnown((k) => k + 1)
    else setUnknown((k) => k + 1)
    setIndex((i) => i + 1)
  }

  const handleReshuffle = () => {
    setOrder(shuffle(flashcards))
    setIndex(0)
    setKnown(0)
    setUnknown(0)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Flashcards</h1>
          <p className="mt-1 text-sm text-slate-600">Révision rapide des concepts clés.</p>
        </div>
        <Button variant="secondary" onClick={handleReshuffle}>
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Mélanger
        </Button>
      </header>

      <Select
        label="Filtrer par thème"
        value={themeFilter}
        onChange={(e) => {
          setThemeFilter(e.target.value)
          setIndex(0)
        }}
      >
        <option value="all">Tous les thèmes</option>
        {THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </Select>

      {!current ? (
        <EmptyState icon={Layers} title="Aucune flashcard pour ce thème" />
      ) : (
        <>
          <p className="text-center text-sm tabular-nums text-slate-500">
            Carte {(index % filtered.length) + 1} / {filtered.length} · Su : {known} · À revoir :{' '}
            {unknown}
          </p>
          <Flashcard key={current.id} front={current.front} back={current.back} />
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => handleAnswer(false)}>
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />À revoir
            </Button>
            <Button onClick={() => handleAnswer(true)}>
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              Je savais
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
