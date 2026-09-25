import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from './hooks/ProgressContext'
import { AppRoutes } from './AppRoutes'

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProgressProvider>
  )
}

export default App
