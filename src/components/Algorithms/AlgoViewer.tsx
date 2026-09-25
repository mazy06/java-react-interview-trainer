import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { highlightCode } from '../../lib/syntaxHighlight'
import type { AlgoKata } from '../../types/algorithm'

const TIER_TONE = {
  1: 'success',
  2: 'brand',
  3: 'warning',
  4: 'danger',
} as const

interface AlgoViewerProps {
  kata: AlgoKata
  index: number
}

export function AlgoViewer({ kata, index }: AlgoViewerProps) {
  const [selectedApproachIndex, setSelectedApproachIndex] = useState(0)
  const approach = kata.approaches[selectedApproachIndex] ?? kata.approaches[0]

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-slate-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="text-lg font-semibold text-slate-900">{kata.title}</h2>
        </div>
        <p className="text-sm text-slate-600">{kata.problem}</p>

        <div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            <span>Approche</span>
            <span>Temps</span>
            <span>Espace</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            {kata.approaches.map((item, itemIndex) => {
              const isSelected = itemIndex === selectedApproachIndex
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedApproachIndex(itemIndex)}
                  aria-pressed={isSelected}
                  className={`grid w-full grid-cols-[1fr_auto_auto] items-center gap-x-3 border-b
                    border-slate-100 px-3 py-2 text-left text-sm transition-colors duration-150
                    ease-out last:border-b-0 motion-reduce:transition-none focus-visible:outline
                    focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600
                    ${isSelected ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
                >
                  <span
                    className={`inline-flex items-center gap-1 ${
                      item.caution ? 'font-semibold text-amber-700' : 'text-slate-700'
                    }`}
                  >
                    {item.caution && (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {item.label}
                  </span>
                  <Badge tone={TIER_TONE[item.tier]} className="font-mono">
                    {item.time}
                  </Badge>
                  <span className="font-mono text-xs text-slate-500">{item.space}</span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="border-l-2 border-brand-500 pl-3 text-sm text-slate-600">{kata.verdict}</p>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Code de référence — {approach.label}
            </p>
            <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
              {kata.lang}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{highlightCode(approach.code, kata.lang)}</code>
          </pre>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Comment ça marche
          </p>
          <p className="text-sm text-slate-600">{approach.explanation}</p>
        </div>
      </CardBody>
    </Card>
  )
}
