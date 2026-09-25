import type { LucideIcon } from 'lucide-react'
import { Card, CardBody } from '../ui/Card'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
}

export function StatTile({ icon: Icon, label, value, hint }: StatTileProps) {
  return (
    <Card>
      <CardBody className="flex items-start gap-3">
        <span className="rounded-lg bg-brand-50 p-2 text-brand-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </CardBody>
    </Card>
  )
}
