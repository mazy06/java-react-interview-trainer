import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Tableau de bord', end: true },
  { to: '/statistics', label: 'Statistiques' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/interview', label: 'Entretien' },
  { to: '/data', label: 'Données' },
]

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg
          focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <GraduationCap className="h-6 w-6 text-brand-600" aria-hidden="true" />
            <span className="hidden sm:inline">Entretiens Java + React</span>
          </NavLink>
          <nav aria-label="Navigation principale" className="flex flex-wrap gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-out
                  motion-reduce:transition-none focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-brand-600
                  ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
