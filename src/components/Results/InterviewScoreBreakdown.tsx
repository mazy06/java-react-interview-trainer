import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import type { InterviewCategoryScore } from '../../lib/interviewScoring'

export function InterviewScoreBreakdown({ scores }: { scores: InterviewCategoryScore[] }) {
  if (scores.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score détaillé de l'entretien simulé</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {scores.map((s) => (
          <div key={s.category}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{s.label}</span>
              <span className="tabular-nums text-slate-500">
                {Math.round(s.successRate * 100)}% ({s.attempts})
              </span>
            </div>
            <ProgressBar value={s.successRate * 100} label={s.label} />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
