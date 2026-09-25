import { useMemo, useState } from 'react'
import { ALGORITHM_KATAS, ALGO_CATEGORIES } from '../data/algorithms'
import { AlgoCard } from '../components/Algorithms/AlgoCard'
import type { AlgoCategory } from '../types/algorithm'

const LEGEND = [
  { tone: 'success', label: 'O(1) / O(log n)' },
  { tone: 'brand', label: 'O(n)' },
  { tone: 'warning', label: 'O(n log n)' },
  { tone: 'danger', label: 'O(n²) et pire' },
] as const

const LEGEND_DOT_CLASS: Record<(typeof LEGEND)[number]['tone'], string> = {
  success: 'bg-emerald-500',
  brand: 'bg-brand-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

function pillClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-out
    motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand-600
    ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`
}

export function AlgorithmsPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<AlgoCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALGORITHM_KATAS.filter((kata) => {
      const matchesCategory = activeCategory === 'all' || kata.category === activeCategory
      const matchesQuery = q === '' || `${kata.title} ${kata.problem}`.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Préparation entretien technique
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Katas Big O — Java &amp; React</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Les implémentations qui reviennent le plus souvent en entretien, avec l&apos;approche
          naïve, l&apos;approche optimale, et pourquoi l&apos;une bat l&apos;autre — pas toujours
          une question de vitesse.
        </p>
        <div className="flex flex-wrap gap-6 pt-1 text-sm text-slate-500">
          <span>
            <strong className="font-mono text-lg text-slate-900">{ALGORITHM_KATAS.length}</strong>{' '}
            katas
          </span>
          <span>
            <strong className="font-mono text-lg text-slate-900">{ALGO_CATEGORIES.length}</strong>{' '}
            catégories
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Échelle de complexité (temps) :</span>
          {LEGEND.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${LEGEND_DOT_CLASS[item.tone]}`}
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Chercher un kata (ex. cache, tri, debounce…)"
          aria-label="Rechercher un kata"
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-brand-600"
        />
        <button
          type="button"
          aria-pressed={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          className={pillClass(activeCategory === 'all')}
        >
          Tous
        </button>
        {ALGO_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            aria-pressed={activeCategory === cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={pillClass(activeCategory === cat.key)}
          >
            {cat.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-xs text-slate-400">
          {filtered.length} / {ALGORITHM_KATAS.length}
        </span>
      </div>

      {ALGO_CATEGORIES.map((cat) => {
        const items = filtered.filter((kata) => kata.category === cat.key)
        if (items.length === 0) return null
        return (
          <section key={cat.key} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">{cat.label}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((kata) => (
                <AlgoCard key={kata.id} kata={kata} index={ALGORITHM_KATAS.indexOf(kata)} />
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-500">
          Aucun kata ne correspond à cette recherche.
        </p>
      )}
    </div>
  )
}
