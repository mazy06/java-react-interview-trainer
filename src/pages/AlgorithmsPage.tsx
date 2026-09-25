import { useState } from 'react'
import { KatasBigOTab } from '../components/Algorithms/KatasBigOTab'
import { DesignPatternsTab } from '../components/Algorithms/DesignPatternsTab'
import { ArchitectureStylesTab } from '../components/Algorithms/ArchitectureStylesTab'

type Tab = 'katas' | 'patterns' | 'architecture'

const TABS: { key: Tab; label: string }[] = [
  { key: 'katas', label: 'Katas Big O' },
  { key: 'patterns', label: 'Design Patterns' },
  { key: 'architecture', label: 'Architecture' },
]

function tabButtonClass(active: boolean) {
  return `-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out
    motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand-600
    ${active ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`
}

export function AlgorithmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('katas')

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Préparation entretien technique
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Algorithmes, Design Patterns &amp; Architecture
        </h1>
      </header>

      <div className="flex gap-2 border-b border-slate-200" role="tablist" aria-label="Sections">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={tabButtonClass(activeTab === tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'katas' && <KatasBigOTab />}
      {activeTab === 'patterns' && <DesignPatternsTab />}
      {activeTab === 'architecture' && <ArchitectureStylesTab />}
    </div>
  )
}
