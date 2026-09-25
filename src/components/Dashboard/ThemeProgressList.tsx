import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { EmptyState } from '../ui/EmptyState'
import { BarChart3 } from 'lucide-react'
import type { ThemeScore } from '../../types/statistics'

export function ThemeProgressList({ themeScores }: { themeScores: ThemeScore[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression par thème</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {themeScores.length === 0 ? (
          <EmptyState icon={BarChart3} title="Aucune session terminée pour l'instant" />
        ) : (
          themeScores
            .sort((a, b) => b.attempts - a.attempts)
            .map((t) => (
              <div key={t.theme}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{t.theme}</span>
                  <span className="tabular-nums text-slate-500">
                    {Math.round(t.successRate * 100)}% ({t.attempts})
                  </span>
                </div>
                <ProgressBar value={t.successRate * 100} label={`Réussite en ${t.theme}`} />
              </div>
            ))
        )}
      </CardBody>
    </Card>
  )
}
