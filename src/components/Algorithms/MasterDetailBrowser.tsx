import { useEffect, useMemo, useState, type ReactNode } from 'react'

interface CategoryMeta<TCategory extends string> {
  key: TCategory
  label: string
}

interface MasterDetailBrowserProps<TItem, TCategory extends string> {
  items: TItem[]
  categories: CategoryMeta<TCategory>[]
  getId: (item: TItem) => string
  getCategory: (item: TItem) => TCategory
  getTitle: (item: TItem) => string
  getSearchText: (item: TItem) => string
  searchPlaceholder: string
  listLabel: string
  emptyMessage: string
  renderViewer: (item: TItem, index: number) => ReactNode
}

function pillClass(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ease-out
    motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand-600
    ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`
}

export function MasterDetailBrowser<TItem, TCategory extends string>({
  items,
  categories,
  getId,
  getCategory,
  getTitle,
  getSearchText,
  searchPlaceholder,
  listLabel,
  emptyMessage,
  renderViewer,
}: MasterDetailBrowserProps<TItem, TCategory>) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<TCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string>(getId(items[0]))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'all' || getCategory(item) === activeCategory
      const matchesQuery = q === '' || getSearchText(item).toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [items, query, activeCategory, getCategory, getSearchText])

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => getId(item) === selectedId)) {
      setSelectedId(getId(filtered[0]))
    }
  }, [filtered, selectedId, getId])

  const selected = filtered.find((item) => getId(item) === selectedId) ?? filtered[0] ?? null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
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
        {categories.map((cat) => (
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
          {filtered.length} / {items.length}
        </span>
      </div>

      {filtered.length === 0 || !selected ? (
        <p className="py-16 text-center text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4 md:h-[75vh] md:grid-cols-[280px_1fr]">
          <nav
            aria-label={listLabel}
            className="overflow-y-auto rounded-xl border border-slate-200 bg-white md:h-full"
          >
            {categories.map((cat) => {
              const catItems = filtered.filter((item) => getCategory(item) === cat.key)
              if (catItems.length === 0) return null
              return (
                <div key={cat.key}>
                  <p className="sticky top-0 border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {cat.label}
                  </p>
                  <ul>
                    {catItems.map((item) => {
                      const id = getId(item)
                      const isSelected = id === getId(selected)
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(id)}
                            aria-current={isSelected}
                            className={`flex w-full items-center gap-1.5 border-b border-slate-50 px-3 py-2 text-left text-sm
                              transition-colors duration-200 ease-out motion-reduce:transition-none
                              focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2
                              focus-visible:outline-brand-600
                              ${isSelected ? 'bg-brand-50 font-medium text-brand-700' : 'text-slate-700 hover:bg-slate-50'}`}
                          >
                            <span className="font-mono text-xs text-slate-400">
                              {String(items.indexOf(item) + 1).padStart(2, '0')}
                            </span>
                            {getTitle(item)}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>

          <div className="overflow-y-auto md:h-full">
            {renderViewer(selected, items.indexOf(selected))}
          </div>
        </div>
      )}
    </div>
  )
}
