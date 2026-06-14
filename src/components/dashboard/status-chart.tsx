'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTheme } from 'next-themes'

interface Props {
  data: { status: string; count: number; color: string }[]
}

export function StatusChart({ data }: Props) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  const filtered = data.filter((d) => d.count > 0)
  if (!filtered.length) return <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-8">Sem dados</p>

  const tooltipBg   = dark ? '#0f172a' : '#ffffff'
  const tooltipBdr  = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const tooltipText = dark ? '#cbd5e1' : '#334155'

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="45%"
          innerRadius={44}
          outerRadius={72}
          paddingAngle={3}
        >
          {filtered.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${tooltipBdr}`,
            borderRadius: '10px',
            fontSize: 12,
            padding: '8px 12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}
          labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: 2 }}
          itemStyle={{ color: tooltipText }}
          formatter={(v, name) => [Number(v), String(name)]}
        />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 11, color: dark ? '#64748b' : '#94a3b8', paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
