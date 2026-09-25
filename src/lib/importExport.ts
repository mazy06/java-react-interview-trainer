import type { Question } from '../types/question'
import type { ProgressState } from '../types/progress'
import type { SessionResult } from '../types/session'
import type { AppExport } from './validation'
import { nowIso, dateFilenameStamp } from './dateUtils'

const EXPORT_VERSION = 1

export function buildAppExport(progress: ProgressState, sessions: SessionResult[]): AppExport {
  return {
    version: EXPORT_VERSION,
    exportedAt: nowIso(),
    progress,
    sessions,
  }
}

export function buildQuestionsExport(questions: Question[]): {
  version: number
  exportedAt: string
  questions: Question[]
} {
  return { version: EXPORT_VERSION, exportedAt: nowIso(), questions }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function statisticsExportFilename(): string {
  return `statistiques-java-react-${dateFilenameStamp()}.json`
}

export function questionsExportFilename(): string {
  return `questions-personnalisees-${dateFilenameStamp()}.json`
}

export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)))
      } catch {
        reject(new Error('Le fichier ne contient pas un JSON valide.'))
      }
    }
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'))
    reader.readAsText(file)
  })
}

export interface MergeQuestionsResult {
  merged: Question[]
  addedCount: number
  skippedDuplicateIds: string[]
}

/**
 * Fusionne des questions importées avec les questions personnalisées existantes.
 * Aucun écrasement silencieux : un identifiant déjà présent est ignoré et signalé.
 */
export function mergeImportedQuestions(
  existing: Question[],
  imported: Question[],
): MergeQuestionsResult {
  const existingIds = new Set(existing.map((q) => q.id))
  const skippedDuplicateIds: string[] = []
  const toAdd: Question[] = []

  for (const question of imported) {
    if (existingIds.has(question.id)) {
      skippedDuplicateIds.push(question.id)
      continue
    }
    existingIds.add(question.id)
    toAdd.push(question)
  }

  return { merged: [...existing, ...toAdd], addedCount: toAdd.length, skippedDuplicateIds }
}
