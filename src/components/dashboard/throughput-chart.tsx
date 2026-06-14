'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { week: string; count: number }[]
}

export function ThroughputChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 0, bottom: 0, left: -24 }}>
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
          formatter={(v) => [Number(v), 'Entregas']}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.count === max ? '#6366f1' : '#e0e7ff'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
