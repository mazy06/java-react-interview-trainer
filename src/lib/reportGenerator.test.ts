import { describe, expect, it } from 'vitest'
import { computeNextReviewRecommendation, reportFilename } from './reportGenerator'

describe('computeNextReviewRecommendation', () => {
  it('recommande de revoir demain sous 50% de réussite', () => {
    expect(computeNextReviewRecommendation(30)).toBe('demain')
    expect(computeNextReviewRecommendation(49)).toBe('demain')
  })

  it('recommande de revoir dans 3 jours entre 50% et 80%', () => {
    expect(computeNextReviewRecommendation(50)).toBe('3-jours')
    expect(computeNextReviewRecommendation(79)).toBe('3-jours')
  })

  it('recommande de revoir dans 7 jours à partir de 80%', () => {
    expect(computeNextReviewRecommendation(80)).toBe('7-jours')
    expect(computeNextReviewRecommendation(100)).toBe('7-jours')
  })
})

describe('reportFilename', () => {
  it('génère un nom de fichier avec le format attendu', () => {
    const date = new Date('2026-09-25T12:00:00.000Z')
    expect(reportFilename(date)).toBe('rapport-java-react-2026-09-25.png')
  })
})
