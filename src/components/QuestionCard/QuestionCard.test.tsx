import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionCard } from './QuestionCard'
import type { McqQuestion, OpenQuestion } from '../../types/question'

const mcqQuestion: McqQuestion = {
  id: 'TEST-MCQ-1',
  source: 'pdf',
  sourcePage: 10,
  chapter: 'Java : le langage',
  theme: 'Java',
  subtheme: 'Test',
  difficulty: 'junior',
  type: 'mcq',
  question: 'Que vaut 2 + 2 ?',
  options: [
    { id: 'a', text: '3' },
    { id: 'b', text: '4' },
  ],
  correctOptionIds: ['b'],
  explanation: '2 + 2 = 4.',
  commonTrap: 'Se tromper de calcul.',
  keyConcept: 'arithmetique-basique',
  tags: [],
  relatedQuestionIds: [],
  reviewIntervals: [1, 3, 7, 14],
  isOriginalPdfContent: true,
  proofType: 'definition',
}

const openQuestion: OpenQuestion = {
  id: 'TEST-OPEN-1',
  source: 'pdf',
  sourcePage: 20,
  chapter: 'React',
  theme: 'React',
  subtheme: 'Test',
  difficulty: 'confirmed',
  type: 'open',
  question: 'Expliquez le rendu React.',
  expectedPoints: ['Point 1', 'Point 2'],
  modelAnswer: 'Réponse modèle.',
  commonTrap: 'Piège classique.',
  keyConcept: 'react-render',
  tags: [],
  relatedQuestionIds: [],
  reviewIntervals: [1, 3, 7, 14],
  isOriginalPdfContent: true,
  proofType: 'definition',
}

function noop() {}

describe('QuestionCard - accessibilité et interaction', () => {
  it('affiche les options mcq avec un rôle checkbox et un état accessible', () => {
    render(
      <QuestionCard
        question={mcqQuestion}
        questionNumber={1}
        totalQuestions={1}
        showInstantCorrection
        timerEnabled={false}
        shuffleAnswers={false}
        favorite={false}
        onToggleFavorite={noop}
        onSubmit={noop}
        onNext={noop}
        isLastQuestion
      />,
    )

    const options = screen.getAllByRole('checkbox')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveAttribute('aria-checked', 'false')
  })

  it('désactive le bouton Valider tant qu’aucune réponse n’est choisie', () => {
    render(
      <QuestionCard
        question={mcqQuestion}
        questionNumber={1}
        totalQuestions={1}
        showInstantCorrection
        timerEnabled={false}
        shuffleAnswers={false}
        favorite={false}
        onToggleFavorite={noop}
        onSubmit={noop}
        onNext={noop}
        isLastQuestion
      />,
    )

    expect(screen.getByRole('button', { name: 'Valider' })).toBeDisabled()
  })

  it('valide une réponse correcte et affiche le verdict via une zone aria-live', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <QuestionCard
        question={mcqQuestion}
        questionNumber={1}
        totalQuestions={1}
        showInstantCorrection
        timerEnabled={false}
        shuffleAnswers={false}
        favorite={false}
        onToggleFavorite={noop}
        onSubmit={onSubmit}
        onNext={noop}
        isLastQuestion
      />,
    )

    await user.click(screen.getByRole('checkbox', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'Valider' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ selectedOptionIds: ['b'], didNotKnow: false }),
    )
    expect(screen.getByText('Bonne réponse')).toBeInTheDocument()
  })

  it('permet de marquer "Je ne sais pas" pour une question ouverte', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <QuestionCard
        question={openQuestion}
        questionNumber={1}
        totalQuestions={1}
        showInstantCorrection
        timerEnabled={false}
        shuffleAnswers={false}
        favorite={false}
        onToggleFavorite={noop}
        onSubmit={onSubmit}
        onNext={noop}
        isLastQuestion
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Je ne sais pas' }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ didNotKnow: true }))
    expect(screen.getByText('Réponse modèle.')).toBeInTheDocument()
  })

  it('le bouton favori expose un état aria-pressed', () => {
    render(
      <QuestionCard
        question={mcqQuestion}
        questionNumber={1}
        totalQuestions={1}
        showInstantCorrection
        timerEnabled={false}
        shuffleAnswers={false}
        favorite={true}
        onToggleFavorite={noop}
        onSubmit={noop}
        onNext={noop}
        isLastQuestion
      />,
    )

    expect(screen.getByRole('button', { name: 'Retirer des favoris' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
