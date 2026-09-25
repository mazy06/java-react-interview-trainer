import { AlertTriangle } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { highlightCode } from '../../lib/syntaxHighlight'
import type { DesignPattern } from '../../types/designPattern'

interface PatternViewerProps {
  pattern: DesignPattern
  index: number
}

export function PatternViewer({ pattern, index }: PatternViewerProps) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-slate-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="text-lg font-semibold text-slate-900">{pattern.title}</h2>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Définition
          </p>
          <p className="text-sm text-slate-600">{pattern.definition}</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quand l&apos;utiliser
          </p>
          <p className="text-sm text-slate-600">{pattern.whenToUse}</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Implémentation
            </p>
            <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
              {pattern.lang}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{highlightCode(pattern.code, pattern.lang)}</code>
          </pre>
        </div>

        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Piège courant
            </p>
            <p className="text-sm text-amber-800">{pattern.pitfall}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
