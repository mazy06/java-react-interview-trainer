import { Scale } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'
import { highlightCode } from '../../lib/syntaxHighlight'
import type { ArchitectureStyle } from '../../types/architectureStyle'

interface ArchitectureStyleViewerProps {
  style: ArchitectureStyle
  index: number
}

export function ArchitectureStyleViewer({ style, index }: ArchitectureStyleViewerProps) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-slate-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="text-lg font-semibold text-slate-900">{style.title}</h2>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Définition
          </p>
          <p className="text-sm text-slate-600">{style.definition}</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quand l&apos;adopter
          </p>
          <p className="text-sm text-slate-600">{style.whenToUse}</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Illustration
            </p>
            <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
              {style.lang}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            <code>{highlightCode(style.code, style.lang)}</code>
          </pre>
        </div>

        <div className="flex gap-2 rounded-lg border border-brand-200 bg-brand-50 p-3">
          <Scale className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-brand-800">
              Compromis à connaître
            </p>
            <p className="text-sm text-brand-800">{style.tradeoff}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
