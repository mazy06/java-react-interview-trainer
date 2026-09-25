import { DESIGN_PATTERNS, PATTERN_CATEGORIES } from '../../data/designPatterns'
import { PatternViewer } from './PatternViewer'
import { MasterDetailBrowser } from './MasterDetailBrowser'

export function DesignPatternsTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Les design patterns les plus demandés en entretien : ce qu&apos;ils résolvent, dans
          quel contexte métier les utiliser, une implémentation de référence, et le piège classique
          à éviter.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
          <span>
            <strong className="font-mono text-lg text-slate-900">{DESIGN_PATTERNS.length}</strong>{' '}
            patterns
          </span>
          <span>
            <strong className="font-mono text-lg text-slate-900">
              {PATTERN_CATEGORIES.length}
            </strong>{' '}
            catégories
          </span>
        </div>
      </div>

      <MasterDetailBrowser
        items={DESIGN_PATTERNS}
        categories={PATTERN_CATEGORIES}
        getId={(pattern) => pattern.id}
        getCategory={(pattern) => pattern.category}
        getTitle={(pattern) => pattern.title}
        getSearchText={(pattern) => `${pattern.title} ${pattern.definition}`}
        searchPlaceholder="Chercher un pattern (ex. singleton, proxy, saga…)"
        listLabel="Liste des design patterns"
        emptyMessage="Aucun pattern ne correspond à cette recherche."
        renderViewer={(pattern, index) => (
          <PatternViewer key={pattern.id} pattern={pattern} index={index} />
        )}
      />
    </div>
  )
}
