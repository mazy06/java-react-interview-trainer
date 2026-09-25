import { useState } from 'react'
import { Button } from '../ui/Button'
import { Card, CardBody } from '../ui/Card'

const DURATIONS = [30, 45, 60, 90] as const
type Duration = (typeof DURATIONS)[number]

/** Environ une question toutes les 3 minutes, mélangeant technique et comportemental. */
function questionCountFor(duration: Duration): number {
  return Math.max(6, Math.round(duration / 3))
}

interface InterviewSetupProps {
  onStart: (duration: Duration, questionCount: number) => void
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [duration, setDuration] = useState<Duration>(60)

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Durée de l'entretien simulé</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={duration === d}
                  onClick={() => setDuration(d)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out
                    motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-brand-600
                    ${duration === d ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {d} minutes
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p className="mb-2 font-medium text-slate-700">Ce qui sera évalué séparément :</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Connaissances techniques</li>
              <li>Raisonnement et compromis</li>
              <li>Diagnostic de panne</li>
              <li>Sécurité</li>
              <li>Qualité des tests</li>
              <li>Communication</li>
              <li>Capacité à reconnaître une limite</li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={() => onStart(duration, questionCountFor(duration))}
            className="w-full sm:w-auto"
          >
            Démarrer la simulation ({questionCountFor(duration)} questions)
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
