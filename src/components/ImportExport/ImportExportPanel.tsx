import { useRef, useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { useProgressContext } from '../../hooks/ProgressContext'
import {
  buildAppExport,
  buildQuestionsExport,
  downloadJson,
  mergeImportedQuestions,
  readJsonFile,
  questionsExportFilename,
  statisticsExportFilename,
} from '../../lib/importExport'
import { validateAppExport, validateQuestionsImport } from '../../lib/validation'
import { Button } from '../ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card'

export function ImportExportPanel() {
  const {
    progress,
    sessions,
    customQuestions,
    importProgressData,
    addCustomQuestions,
    resetProgress,
  } = useProgressContext()
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const statsInputRef = useRef<HTMLInputElement>(null)
  const questionsInputRef = useRef<HTMLInputElement>(null)

  const handleExportStats = () => {
    downloadJson(statisticsExportFilename(), buildAppExport(progress, sessions))
    setMessage('Statistiques exportées.')
    setErrors([])
  }

  const handleExportQuestions = () => {
    downloadJson(questionsExportFilename(), buildQuestionsExport(customQuestions))
    setMessage('Questions personnalisées exportées.')
    setErrors([])
  }

  const handleImportStats = async (file: File) => {
    setMessage(null)
    setErrors([])
    try {
      const raw = await readJsonFile(file)
      const result = validateAppExport(raw)
      if (!result.valid || !result.data) {
        setErrors(result.errors)
        return
      }
      const confirmed = window.confirm(
        'Importer ce fichier remplacera vos statistiques et sessions actuelles. Continuer ?',
      )
      if (!confirmed) return
      importProgressData({ progress: result.data.progress, sessions: result.data.sessions })
      setMessage('Statistiques importées avec succès.')
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Erreur inconnue lors de l’import.'])
    }
  }

  const handleImportQuestions = async (file: File) => {
    setMessage(null)
    setErrors([])
    try {
      const raw = await readJsonFile(file)
      const parsed = (raw as { questions?: unknown }).questions ?? raw
      const result = validateQuestionsImport(parsed)
      if (!result.valid || !result.data) {
        setErrors(result.errors)
        return
      }
      const { addedCount, skippedDuplicateIds } = mergeImportedQuestions(
        customQuestions,
        result.data,
      )
      addCustomQuestions(result.data.filter((q) => !skippedDuplicateIds.includes(q.id)))
      setMessage(
        `${addedCount} question(s) ajoutée(s).` +
          (skippedDuplicateIds.length > 0
            ? ` ${skippedDuplicateIds.length} identifiant(s) déjà existants ignoré(s) : ${skippedDuplicateIds.join(', ')}.`
            : ''),
      )
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Erreur inconnue lors de l’import.'])
    }
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Réinitialiser votre progression supprimera définitivement vos statistiques et sessions locales. Continuer ?',
    )
    if (!confirmed) return
    resetProgress()
    setMessage('Progression réinitialisée.')
    setErrors([])
  }

  return (
    <div className="space-y-6">
      {message && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Le fichier importé est invalide :</p>
          <ul className="mt-1 list-inside list-disc">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Statistiques et progression</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExportStats}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Exporter en JSON
          </Button>
          <Button variant="secondary" onClick={() => statsInputRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Importer un fichier JSON
          </Button>
          <input
            ref={statsInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportStats(file)
              e.target.value = ''
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions personnalisées</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExportQuestions}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Exporter mes questions
          </Button>
          <Button variant="secondary" onClick={() => questionsInputRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Importer des questions
          </Button>
          <input
            ref={questionsInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportQuestions(file)
              e.target.value = ''
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zone dangereuse</CardTitle>
        </CardHeader>
        <CardBody>
          <Button variant="danger" onClick={handleReset}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Réinitialiser ma progression
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
