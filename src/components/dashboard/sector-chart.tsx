'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from 'next-themes'

interface Props {
  data: { sector: string; count: number; color: string }[]
}

export function SectorChart({ data }: Props) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  if (!data.length) return <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-6">Sem projetos por setor</p>

  const tickColor   = dark ? '#94a3b8' : '#64748b'
  const axisColor   = dark ? '#475569' : '#94a3b8'
  const tooltipBg   = dark ? '#0f172a' : '#ffffff'
  const tooltipBdr  = dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
  const tooltipText = dark ? '#cbd5e1' : '#334155'
  const cursor      = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'

  const height = Math.max(140, data.length * 48)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" barSize={22} margin={{ top: 4, right: 24, bottom: 4, left: 80 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="sector" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} width={76} />
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
          labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: 2 }}
          itemStyle={{ color: tooltipText }}
          formatter={(v) => [Number(v), 'Projetos']}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
