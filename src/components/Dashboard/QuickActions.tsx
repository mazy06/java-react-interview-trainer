import { Link } from 'react-router-dom'
import {
  Play,
  RotateCcw,
  Timer,
  Mic,
  BarChart3,
  Star,
  DatabaseBackup,
  Layers,
  Braces,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Action {
  to: string
  label: string
  icon: LucideIcon
  tone: 'primary' | 'default'
}

const ACTIONS: Action[] = [
  { to: '/session/new', label: 'Nouvelle session', icon: Play, tone: 'primary' },
  {
    to: '/session/new?mode=review-errors',
    label: 'Révision des points faibles',
    icon: RotateCcw,
    tone: 'default',
  },
  { to: '/session/new?mode=exam', label: 'Mode examen', icon: Timer, tone: 'default' },
  { to: '/interview', label: "Simulations d'entretien", icon: Mic, tone: 'default' },
  { to: '/statistics', label: 'Statistiques', icon: BarChart3, tone: 'default' },
  { to: '/session/new?mode=favorites', label: 'Favoris', icon: Star, tone: 'default' },
  { to: '/flashcards', label: 'Flashcards', icon: Layers, tone: 'default' },
  { to: '/algorithms', label: 'Katas Big O', icon: Braces, tone: 'default' },
  { to: '/data', label: 'Import / export', icon: DatabaseBackup, tone: 'default' },
]

export function QuickActions() {
  return (
    <nav aria-label="Actions rapides" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map(({ to, label, icon: Icon, tone }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center text-sm font-medium
            transition-colors duration-200 ease-out motion-reduce:transition-none
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600
            ${
              tone === 'primary'
                ? 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
