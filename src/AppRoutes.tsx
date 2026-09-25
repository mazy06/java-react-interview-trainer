import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { SessionSetupPage } from './pages/SessionSetupPage'
import { SessionPage } from './pages/SessionPage'
import { ResultsPage } from './pages/ResultsPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { InterviewPage } from './pages/InterviewPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { ImportExportPage } from './pages/ImportExportPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/session/new" element={<SessionSetupPage />} />
        <Route path="/session/play" element={<SessionPage />} />
        <Route path="/session/results" element={<ResultsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/data" element={<ImportExportPage />} />
      </Route>
    </Routes>
  )
}
