import { ALGORITHM_KATAS, ALGO_CATEGORIES } from '../../data/algorithms'
import { AlgoViewer } from './AlgoViewer'
import { MasterDetailBrowser } from './MasterDetailBrowser'

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

export function KatasBigOTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Les implémentations qui reviennent le plus souvent en entretien, avec l&apos;approche
          naïve, l&apos;approche optimale, et pourquoi l&apos;une bat l&apos;autre — pas toujours
          une question de vitesse.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
          <span>
            <strong className="font-mono text-lg text-slate-900">{ALGORITHM_KATAS.length}</strong>{' '}
            katas
          </span>
          <span>
            <strong className="font-mono text-lg text-slate-900">{ALGO_CATEGORIES.length}</strong>{' '}
            catégories
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
      </div>

      <MasterDetailBrowser
        items={ALGORITHM_KATAS}
        categories={ALGO_CATEGORIES}
        getId={(kata) => kata.id}
        getCategory={(kata) => kata.category}
        getTitle={(kata) => kata.title}
        getSearchText={(kata) => `${kata.title} ${kata.problem}`}
        searchPlaceholder="Chercher un kata (ex. cache, tri, debounce…)"
        listLabel="Liste des katas"
        emptyMessage="Aucun kata ne correspond à cette recherche."
        renderViewer={(kata, index) => <AlgoViewer key={kata.id} kata={kata} index={index} />}
      />
    </div>
  )
}
