import { useEffect, useMemo, useState } from 'react'
import { Flag, Star, Clock } from 'lucide-react'
import type { Question } from '../../types/question'
import type { SelfRating } from '../../types/session'
import { isMcq, isOpen, isCode } from '../../types/question'
import { shuffleOptions } from '../../lib/questionSelector'
import { formatDuration } from '../../lib/dateUtils'
import { AnswerOption } from '../AnswerOption/AnswerOption'
import { SelfRatingInput } from './SelfRatingInput'
import { QuestionFeedback } from './QuestionFeedback'
import { CodeBlock } from './CodeBlock'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const DIFFICULTY_LABELS: Record<Question['difficulty'], string> = {
  junior: 'Junior',
  intermediate: 'Intermédiaire',
  confirmed: 'Confirmé',
  advanced: 'Approfondissement',
}

export interface QuestionCardSubmission {
  selectedOptionIds?: string[]
  selfRating?: SelfRating | null
  didNotKnow?: boolean
  flaggedForReview?: boolean
  reportedIssue?: boolean
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  showInstantCorrection: boolean
  timerEnabled: boolean
  shuffleAnswers: boolean
  favorite: boolean
  onToggleFavorite: () => void
  onSubmit: (submission: QuestionCardSubmission) => void
  onNext: () => void
  isLastQuestion: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  showInstantCorrection,
  timerEnabled,
  shuffleAnswers,
  favorite,
  onToggleFavorite,
  onSubmit,
  onNext,
  isLastQuestion,
}: QuestionCardProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [selfRating, setSelfRating] = useState<SelfRating | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [didNotKnow, setDidNotKnow] = useState(false)
  const [understood, setUnderstood] = useState<boolean | null>(null)
  const [reviewLater, setReviewLater] = useState(false)
  const [reported, setReported] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  const displayedOptions = useMemo(() => {
    if (!isMcq(question)) return []
    return shuffleAnswers ? shuffleOptions(question.options) : question.options
  }, [question, shuffleAnswers])

  useEffect(() => {
    setSelectedOptionIds([])
    setSelfRating(null)
    setSubmitted(false)
    setDidNotKnow(false)
    setUnderstood(null)
    setReviewLater(false)
    setReported(false)
    setElapsedMs(0)
  }, [question.id])

  useEffect(() => {
    if (!timerEnabled || submitted) return
    const start = Date.now()
    const id = window.setInterval(() => setElapsedMs(Date.now() - start), 1000)
    return () => window.clearInterval(id)
  }, [timerEnabled, submitted, question.id])

  const toggleOption = (optionId: string) => {
    if (submitted) return
    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    )
  }

  const isMcqAnswerCorrect =
    isMcq(question) &&
    selectedOptionIds.length === question.correctOptionIds.length &&
    selectedOptionIds.every((id) => question.correctOptionIds.includes(id))

  const handleValidate = () => {
    setSubmitted(true)
    onSubmit({ selectedOptionIds, selfRating, didNotKnow })
  }

  const handleDontKnow = () => {
    setDidNotKnow(true)
    setSubmitted(true)
    onSubmit({ selectedOptionIds: [], selfRating: 0, didNotKnow: true })
  }

  const handleReport = () => {
    setReported(true)
    onSubmit({ selectedOptionIds, selfRating, didNotKnow, reportedIssue: true })
  }

  const handleReviewLaterToggle = () => {
    setReviewLater((prev) => !prev)
    onSubmit({ selectedOptionIds, selfRating, didNotKnow, flaggedForReview: !reviewLater })
  }

  const canValidate = isMcq(question) ? selectedOptionIds.length > 0 : selfRating !== null

  const verdict: boolean | null = didNotKnow
    ? false
    : submitted && isMcq(question)
      ? isMcqAnswerCorrect
      : submitted && selfRating !== null
        ? selfRating >= 3
        : null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{question.theme}</Badge>
          <Badge tone="neutral">{question.subtheme}</Badge>
          <Badge tone="neutral">{DIFFICULTY_LABELS[question.difficulty]}</Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500">
          {timerEnabled && (
            <span className="flex items-center gap-1 tabular-nums">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {formatDuration(elapsedMs)}
            </span>
          )}
          <span className="tabular-nums">
            Question {questionNumber} / {totalQuestions}
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{question.question}</h2>
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={onToggleFavorite}
          className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-amber-500
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Star
            className={`h-5 w-5 ${favorite ? 'fill-amber-400 text-amber-500' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {question.code && <CodeBlock code={question.code} />}

      {isMcq(question) && (
        <div role="group" aria-label="Propositions de réponse" className="space-y-2">
          {displayedOptions.map((option) => (
            <AnswerOption
              key={option.id}
              option={option}
              selected={selectedOptionIds.includes(option.id)}
              revealed={submitted && showInstantCorrection}
              isCorrectOption={question.correctOptionIds.includes(option.id)}
              disabled={submitted}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
        </div>
      )}

      {isOpen(question) && !submitted && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Formulez votre réponse à voix haute ou par écrit, puis auto-évaluez-vous ci-dessous.
        </p>
      )}

      {isCode(question) && !submitted && (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          Proposez votre correction, puis auto-évaluez-vous ci-dessous.
        </p>
      )}

      {!isMcq(question) && !submitted && (
        <SelfRatingInput value={selfRating} onChange={setSelfRating} />
      )}

      {!submitted ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button onClick={handleValidate} disabled={!canValidate}>
            Valider
          </Button>
          <Button variant="secondary" onClick={handleDontKnow}>
            Je ne sais pas
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReport} disabled={reported}>
            <Flag className="h-4 w-4" aria-hidden="true" />
            {reported ? 'Signalée' : 'Signaler'}
          </Button>
        </div>
      ) : (
        <>
          {showInstantCorrection || !isMcq(question) ? (
            <QuestionFeedback
              question={question}
              isCorrect={verdict}
              onMarkNotUnderstood={() => setUnderstood(false)}
              onReviewLater={handleReviewLaterToggle}
              understood={understood}
              reviewLater={reviewLater}
            />
          ) : (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              Réponse enregistrée. La correction sera visible dans le récapitulatif de fin de
              session.
            </p>
          )}
          <Button onClick={onNext}>
            {isLastQuestion ? 'Voir les résultats' : 'Question suivante'}
          </Button>
        </>
      )}
    </div>
  )
}
