import { ARCHITECTURE_CATEGORIES, ARCHITECTURE_STYLES } from '../../data/architectureStyles'
import { ArchitectureStyleViewer } from './ArchitectureStyleViewer'
import { MasterDetailBrowser } from './MasterDetailBrowser'

export function ArchitectureStylesTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Les grands styles d&apos;architecture demandés en entretien : ce qu&apos;ils signifient
          concrètement, dans quel contexte les choisir, une illustration de référence, et le
          compromis qu&apos;ils imposent — aucun n&apos;est universellement meilleur qu&apos;un
          autre.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-slate-500">
          <span>
            <strong className="font-mono text-lg text-slate-900">
              {ARCHITECTURE_STYLES.length}
            </strong>{' '}
            styles
          </span>
          <span>
            <strong className="font-mono text-lg text-slate-900">
              {ARCHITECTURE_CATEGORIES.length}
            </strong>{' '}
            catégories
          </span>
        </div>
      </div>

      <MasterDetailBrowser
        items={ARCHITECTURE_STYLES}
        categories={ARCHITECTURE_CATEGORIES}
        getId={(style) => style.id}
        getCategory={(style) => style.category}
        getTitle={(style) => style.title}
        getSearchText={(style) => `${style.title} ${style.definition}`}
        searchPlaceholder="Chercher un style (ex. hexagonale, event, serverless…)"
        listLabel="Liste des styles d'architecture"
        emptyMessage="Aucun style d'architecture ne correspond à cette recherche."
        renderViewer={(style, index) => (
          <ArchitectureStyleViewer key={style.id} style={style} index={index} />
        )}
      />
    </div>
  )
}
