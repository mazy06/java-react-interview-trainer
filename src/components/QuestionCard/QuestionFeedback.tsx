import { CheckCircle2, XCircle, HelpCircle, BookmarkPlus } from 'lucide-react'
import type { Question } from '../../types/question'
import { isOpen, isCode } from '../../types/question'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { CodeBlock } from './CodeBlock'

interface QuestionFeedbackProps {
  question: Question
  isCorrect: boolean | null
  onMarkNotUnderstood: () => void
  onReviewLater: () => void
  understood: boolean | null
  reviewLater: boolean
}

export function QuestionFeedback({
  question,
  isCorrect,
  onMarkNotUnderstood,
  onReviewLater,
  understood,
  reviewLater,
}: QuestionFeedbackProps) {
  const showsVerdict = isCorrect !== null

  return (
    <div
      className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
      aria-live="polite"
    >
      {showsVerdict && (
        <div
          className={`flex items-center gap-2 text-sm font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <XCircle className="h-5 w-5" aria-hidden="true" />
          )}
          {isCorrect ? 'Bonne réponse' : 'Réponse incorrecte'}
        </div>
      )}

      {isOpen(question) && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Réponse attendue
          </p>
          <p className="text-sm text-slate-800">{question.modelAnswer}</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
            {question.expectedPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {isCode(question) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Réponse attendue
          </p>
          <p className="text-sm text-slate-800">{question.expectedAnswer}</p>
          <div className="flex flex-wrap gap-1">
            {question.acceptedConcepts.map((c) => (
              <Badge key={c} tone="brand">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {'explanation' in question && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Explication
          </p>
          <p className="text-sm text-slate-800">{question.explanation}</p>
        </div>
      )}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Piège courant
        </p>
        <p className="text-sm text-slate-800">{question.commonTrap}</p>
      </div>

      {question.type === 'mcq' && question.code && <CodeBlock code={question.code} />}

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Badge tone="neutral">{question.chapter}</Badge>
        <Badge tone="neutral">
          {question.source === 'pdf' ? `Guide, ${question.id}` : 'Question ajoutée'}
        </Badge>
        {question.sourcePage && <Badge tone="neutral">Page {question.sourcePage}</Badge>}
        {question.versionWarning && <Badge tone="warning">{question.versionWarning}</Badge>}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          variant={understood === false ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onMarkNotUnderstood}
          aria-pressed={understood === false}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          Je n'ai pas compris
        </Button>
        <Button
          variant={reviewLater ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onReviewLater}
          aria-pressed={reviewLater}
        >
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          Revoir plus tard
        </Button>
      </div>
    </div>
  )
}
