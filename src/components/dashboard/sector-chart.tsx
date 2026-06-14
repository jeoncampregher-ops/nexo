'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { sector: string; count: number; color: string }[]
}

export function SectorChart({ data }: Props) {
  if (!data.length) return <p className="text-sm text-slate-400 text-center py-4">Sem projetos por setor</p>

  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data} layout="vertical" barSize={14} margin={{ top: 0, right: 16, bottom: 0, left: 64 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="sector" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
        <Tooltip
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
          formatter={(v) => [Number(v), 'Projetos']}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
