import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ThemeScore } from '../../types/statistics'

export function ThemeBreakdownChart({ themeScores }: { themeScores: ThemeScore[] }) {
  const data = themeScores.map((t) => ({
    theme: t.theme,
    'Réussite (%)': Math.round(t.successRate * 100),
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="theme"
            angle={-35}
            textAnchor="end"
            interval={0}
            height={70}
            tick={{ fontSize: 11 }}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="Réussite (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
