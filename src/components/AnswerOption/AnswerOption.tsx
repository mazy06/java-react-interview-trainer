import { Check, X } from 'lucide-react'
import type { QuestionOption } from '../../types/question'

interface AnswerOptionProps {
  option: QuestionOption
  selected: boolean
  revealed: boolean
  isCorrectOption: boolean
  disabled: boolean
  onToggle: () => void
}

export function AnswerOption({
  option,
  selected,
  revealed,
  isCorrectOption,
  disabled,
  onToggle,
}: AnswerOptionProps) {
  let toneClasses = 'border-slate-300 bg-white hover:bg-slate-50'
  let icon: React.ReactNode = null

  if (revealed) {
    if (isCorrectOption) {
      toneClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900'
      icon = <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
    } else if (selected) {
      toneClasses = 'border-red-500 bg-red-50 text-red-900'
      icon = <X className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
    }
  } else if (selected) {
    toneClasses = 'border-brand-600 bg-brand-50 text-brand-900'
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm
        transition-colors duration-200 ease-out motion-reduce:transition-none
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600
        disabled:cursor-not-allowed ${toneClasses}`}
    >
      <span>{option.text}</span>
      {icon}
    </button>
  )
}
