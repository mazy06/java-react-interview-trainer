import { useState } from 'react'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { AlgoKata } from '../../types/algorithm'

const TIER_TONE = {
  1: 'success',
  2: 'brand',
  3: 'warning',
  4: 'danger',
} as const

interface AlgoCardProps {
  kata: AlgoKata
  index: number
}

export function AlgoCard({ kata, index }: AlgoCardProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-slate-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-base font-semibold text-slate-900">{kata.title}</h3>
        </div>
        <p className="text-sm text-slate-600">{kata.problem}</p>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="pb-1.5 pr-2">Approche</th>
              <th className="pb-1.5 pr-2">Temps</th>
              <th className="pb-1.5">Espace</th>
            </tr>
          </thead>
          <tbody>
            {kata.approaches.map((approach) => (
              <tr key={approach.label} className="border-t border-slate-100">
                <td className="py-1.5 pr-2">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      approach.caution ? 'font-semibold text-amber-700' : 'text-slate-700'
                    }`}
                  >
                    {approach.caution && (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    )}
                    {approach.label}
                  </span>
                </td>
                <td className="py-1.5 pr-2">
                  <Badge tone={TIER_TONE[approach.tier]} className="font-mono">
                    {approach.time}
                  </Badge>
                </td>
                <td className="py-1.5 font-mono text-xs text-slate-500">{approach.space}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="border-l-2 border-brand-500 pl-3 text-sm text-slate-600">{kata.verdict}</p>

        <button
          type="button"
          onClick={() => setShowCode((prev) => !prev)}
          aria-expanded={showCode}
          className="flex items-center gap-1 self-start text-xs font-semibold text-brand-700
            transition-colors duration-200 ease-out motion-reduce:transition-none hover:text-brand-800
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-brand-600"
        >
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none ${
              showCode ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          />
          {showCode ? 'Masquer le code' : 'Voir le code'}
          <span className="ml-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">
            {kata.lang}
          </span>
        </button>

        {showCode && (
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{kata.code}</code>
          </pre>
        )}
      </CardBody>
    </Card>
  )
}
