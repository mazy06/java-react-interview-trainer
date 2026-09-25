import type { Question, QuestionType } from '../types/question'
import type { ProgressState } from '../types/progress'
import type { SessionResult } from '../types/session'

export interface ValidationResult<T> {
  valid: boolean
  errors: string[]
  data?: T
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

const VALID_QUESTION_TYPES: QuestionType[] = ['mcq', 'open', 'code']

function validateQuestion(value: unknown, index: number, errors: string[]): value is Question {
  if (!isObject(value)) {
    errors.push(`Question #${index} : n'est pas un objet.`)
    return false
  }
  const requiredStrings = [
    'id',
    'chapter',
    'theme',
    'subtheme',
    'difficulty',
    'question',
    'keyConcept',
    'commonTrap',
  ]
  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string' || value[field] === '') {
      errors.push(
        `Question #${index} (${String(value.id ?? '?')}) : champ "${field}" manquant ou vide.`,
      )
    }
  }
  if (!VALID_QUESTION_TYPES.includes(value.type as QuestionType)) {
    errors.push(
      `Question #${index} : type "${String(value.type)}" invalide (attendu mcq, open ou code).`,
    )
    return false
  }
  if (!isStringArray(value.tags))
    errors.push(`Question #${index} : "tags" doit être un tableau de chaînes.`)
  if (!isStringArray(value.relatedQuestionIds)) {
    errors.push(`Question #${index} : "relatedQuestionIds" doit être un tableau de chaînes.`)
  }
  if (value.type === 'mcq') {
    if (!Array.isArray(value.options) || value.options.length === 0) {
      errors.push(`Question #${index} : une question mcq doit avoir des "options".`)
    }
    if (!isStringArray(value.correctOptionIds) || value.correctOptionIds.length === 0) {
      errors.push(`Question #${index} : une question mcq doit avoir "correctOptionIds".`)
    }
  }
  if (value.type === 'open') {
    if (typeof value.modelAnswer !== 'string' || value.modelAnswer === '') {
      errors.push(`Question #${index} : une question ouverte doit avoir "modelAnswer".`)
    }
    if (!isStringArray(value.expectedPoints)) {
      errors.push(`Question #${index} : une question ouverte doit avoir "expectedPoints".`)
    }
  }
  if (value.type === 'code') {
    if (typeof value.code !== 'string' || value.code === '') {
      errors.push(`Question #${index} : une question code doit avoir "code".`)
    }
    if (typeof value.expectedAnswer !== 'string' || value.expectedAnswer === '') {
      errors.push(`Question #${index} : une question code doit avoir "expectedAnswer".`)
    }
  }
  return true
}

export function validateQuestionsImport(raw: unknown): ValidationResult<Question[]> {
  const errors: string[] = []
  if (!Array.isArray(raw)) {
    return { valid: false, errors: ['Le fichier doit contenir un tableau JSON de questions.'] }
  }
  raw.forEach((item, index) => validateQuestion(item, index, errors))

  const ids = new Set<string>()
  raw.forEach((item) => {
    if (isObject(item) && typeof item.id === 'string') {
      if (ids.has(item.id)) errors.push(`Identifiant en double dans l'import : "${item.id}".`)
      ids.add(item.id)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (raw as Question[]) : undefined,
  }
}

export interface AppExport {
  version: number
  exportedAt: string
  progress: ProgressState
  sessions: SessionResult[]
}

export function validateAppExport(raw: unknown): ValidationResult<AppExport> {
  const errors: string[] = []
  if (!isObject(raw)) {
    return { valid: false, errors: ['Le fichier ne contient pas un objet JSON valide.'] }
  }
  if (typeof raw.version !== 'number') errors.push('Champ "version" manquant ou invalide.')
  if (typeof raw.exportedAt !== 'string') errors.push('Champ "exportedAt" manquant ou invalide.')
  if (!isObject(raw.progress)) {
    errors.push('Champ "progress" manquant ou invalide.')
  } else {
    if (!isObject(raw.progress.concepts)) errors.push('"progress.concepts" doit être un objet.')
    if (!isObject(raw.progress.questions)) errors.push('"progress.questions" doit être un objet.')
  }
  if (!Array.isArray(raw.sessions))
    errors.push('Champ "sessions" manquant ou invalide (tableau attendu).')

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (raw as unknown as AppExport) : undefined,
  }
}
