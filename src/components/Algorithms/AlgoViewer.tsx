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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Code de référence
            </p>
            <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
              {kata.lang}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{highlightCode(kata.code, kata.lang)}</code>
          </pre>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Comment ça marche
          </p>
          <p className="text-sm text-slate-600">{kata.explanation}</p>
        </div>
      </CardBody>
    </Card>
  )
}
