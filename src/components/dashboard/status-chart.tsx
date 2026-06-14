'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: { status: string; count: number; color: string }[]
}

export function StatusChart({ data }: Props) {
  const filtered = data.filter((d) => d.count > 0)
  if (!filtered.length) return <p className="text-sm text-slate-400 text-center py-8">Sem dados</p>

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={filtered} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={64} paddingAngle={2}>
          {filtered.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
          formatter={(v, name) => [Number(v), String(name)]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
