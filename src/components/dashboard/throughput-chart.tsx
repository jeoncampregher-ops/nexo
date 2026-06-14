'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from 'next-themes'

interface Props {
  data: { week: string; count: number }[]
}

export function ThroughputChart({ data }: Props) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  const max = Math.max(...data.map((d) => d.count), 1)

  const tickColor   = dark ? '#475569' : '#94a3b8'
  const tooltipBg   = dark ? '#0f172a' : '#ffffff'
  const tooltipBdr  = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const tooltipText = dark ? '#cbd5e1' : '#334155'
  const barInactive = dark ? 'rgba(99,102,241,0.14)' : '#e0e7ff'
  const cursor      = dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: cursor }}
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${tooltipBdr}`,
            borderRadius: '10px',
            fontSize: 12,
            padding: '8px 12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}
          labelStyle={{ color: dark ? '#64748b' : '#94a3b8', marginBottom: 2, fontWeight: 600 }}
          itemStyle={{ color: tooltipText }}
          formatter={(v) => [Number(v), 'Entregas']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.count === max ? '#6366f1' : barInactive} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
