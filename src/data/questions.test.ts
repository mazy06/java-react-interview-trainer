import { describe, expect, it } from 'vitest'
import questionsData from './questions.json'
import type { Question, Theme } from '../types/question'

const questions = questionsData as Question[]

function firstOfTheme(theme: Theme): Question {
  const found = questions.find((q) => q.theme === theme)
  if (!found) throw new Error(`Aucune question trouvée pour le thème ${theme}`)
  return found
}

describe('Corpus de questions - intégrité globale', () => {
  it('contient au moins 150 questions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(150)
  })

  it('n’a aucun identifiant en double', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ne référence que des relatedQuestionIds existants', () => {
    const ids = new Set(questions.map((q) => q.id))
    for (const q of questions) {
      for (const relatedId of q.relatedQuestionIds) {
        expect(ids.has(relatedId)).toBe(true)
      }
    }
  })

  it('respecte les minimums par thème demandés', () => {
    const counts = new Map<string, number>()
    for (const q of questions) counts.set(q.theme, (counts.get(q.theme) ?? 0) + 1)

    expect(counts.get('Java') ?? 0).toBeGreaterThanOrEqual(25)
    expect(counts.get('Spring') ?? 0).toBeGreaterThanOrEqual(20)
    expect(counts.get('JPA/Hibernate') ?? 0).toBeGreaterThanOrEqual(20)
    expect(counts.get('SQL') ?? 0).toBeGreaterThanOrEqual(15)
    expect(
      (counts.get('JavaScript') ?? 0) + (counts.get('TypeScript') ?? 0),
    ).toBeGreaterThanOrEqual(15)
    expect(counts.get('React') ?? 0).toBeGreaterThanOrEqual(30)
    expect(counts.get('Tests') ?? 0).toBeGreaterThanOrEqual(10)
    expect(counts.get('Sécurité') ?? 0).toBeGreaterThanOrEqual(10)
    expect(counts.get('Entretien comportemental') ?? 0).toBeGreaterThanOrEqual(10)
  })

  it('marque comme "added" toute question qui ne vient pas du PDF', () => {
    for (const q of questions) {
      if (q.source === 'added') {
        expect(q.isOriginalPdfContent).toBe(false)
      }
      if (q.isOriginalPdfContent) {
        expect(q.source).toBe('pdf')
      }
    }
  })
})

describe('Une question par thème critique a une structure complète', () => {
  it('une question Java a un concept clé, un piège et une explication ou un modèle de réponse', () => {
    const q = firstOfTheme('Java')
    expect(q.keyConcept).toBeTruthy()
    expect(q.commonTrap).toBeTruthy()
    expect(q.type === 'mcq' || q.type === 'code' ? 'explanation' in q : 'modelAnswer' in q).toBe(
      true,
    )
  })

  it('une question Spring a un thème et une source valides', () => {
    const q = firstOfTheme('Spring')
    expect(q.theme).toBe('Spring')
    expect(['pdf', 'added']).toContain(q.source)
  })

  it('une question JPA/Hibernate référence un chapitre', () => {
    const q = firstOfTheme('JPA/Hibernate')
    expect(q.chapter).toBeTruthy()
  })

  it('une question SQL a des tags renseignés', () => {
    const q = firstOfTheme('SQL')
    expect(q.tags.length).toBeGreaterThan(0)
  })

  it('une question React a des intervalles de révision définis', () => {
    const q = firstOfTheme('React')
    expect(q.reviewIntervals.length).toBeGreaterThan(0)
  })

  it('une question TypeScript a un niveau de difficulté valide', () => {
    const q = firstOfTheme('TypeScript')
    expect(['junior', 'intermediate', 'confirmed', 'advanced']).toContain(q.difficulty)
  })
})
