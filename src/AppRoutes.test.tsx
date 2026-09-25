import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { ProgressProvider } from './hooks/ProgressContext'

function renderApp(initialPath = '/') {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('Navigation principale', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('affiche le tableau de bord sur la route racine', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: /entraînement java \+ react/i })).toBeInTheDocument()
  })

  it('navigue vers la page Statistiques via le lien de navigation', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })

    await user.click(within(nav).getByRole('link', { name: 'Statistiques' }))

    expect(screen.getByRole('heading', { name: 'Statistiques' })).toBeInTheDocument()
  })

  it('navigue vers la page Flashcards via le lien de navigation', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'Navigation principale' })

    await user.click(within(nav).getByRole('link', { name: 'Flashcards' }))

    expect(screen.getByRole('heading', { name: 'Flashcards' })).toBeInTheDocument()
  })

  it("affiche un message d'attente si aucune session n'a été configurée avant /session/play", () => {
    renderApp('/session/play')
    expect(screen.getByText('Aucune configuration de session')).toBeInTheDocument()
  })
})
