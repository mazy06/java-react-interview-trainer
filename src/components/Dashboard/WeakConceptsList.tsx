import { TrendingDown } from 'lucide-react'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface WeakConcept {
  conceptId: string
  successRate: number
}

export function WeakConceptsList({ concepts }: { concepts: WeakConcept[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Concepts les plus faibles</CardTitle>
      </CardHeader>
      <CardBody>
        {concepts.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Pas encore de données"
            description="Terminez une session pour voir apparaître vos points faibles ici."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {concepts.map((c) => (
              <li key={c.conceptId} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-700">{c.conceptId}</span>
                <span className="tabular-nums font-medium text-red-600">
                  {Math.round(c.successRate * 100)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
