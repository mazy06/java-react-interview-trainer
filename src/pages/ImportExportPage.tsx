import { ImportExportPanel } from '../components/ImportExport/ImportExportPanel'

export function ImportExportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Import / export des données</h1>
        <p className="mt-1 text-sm text-slate-600">
          Toutes vos données restent locales à ce navigateur. Sauvegardez-les régulièrement.
        </p>
      </header>
      <ImportExportPanel />
    </div>
  )
}
