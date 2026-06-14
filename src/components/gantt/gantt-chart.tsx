'use client'

import { useMemo } from 'react'
import { addDays, addWeeks, differenceInDays, format, isAfter, isBefore, max, min, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { isDelayed } from '@/lib/utils'
import type { Project } from '@/lib/types'

const LABEL_COL = 220
const WEEK_COL = 80

interface Props {
  projects: Project[]
}

export function GanttChart({ projects }: Props) {
  const { weeks, rows } = useMemo(() => buildGantt(projects), [projects])

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <p className="text-sm">Nenhum projeto com datas para exibir no Gantt.</p>
        <p className="text-xs">Adicione uma data de início ou entrega aos projetos.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: LABEL_COL + weeks.length * WEEK_COL }}>
        {/* Header */}
        <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10">
          <div style={{ width: LABEL_COL, minWidth: LABEL_COL }} className="flex-shrink-0 px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide border-r border-slate-100">
            Projeto
          </div>
          <div className="flex flex-1">
            {weeks.map((w) => (
              <div
                key={w.toISOString()}
                style={{ width: WEEK_COL, minWidth: WEEK_COL }}
                className="px-1 py-2 text-[10px] text-slate-400 text-center border-r border-slate-100 font-medium"
              >
                {format(w, 'dd/MM', { locale: ptBR })}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {rows.map(({ project, startCol, endCol }) => {
          const delayed = isDelayed(project.expected_date, project.completed_at)
          const color = project.sector?.color ?? '#6366f1'

          return (
            <div key={project.id} className="flex items-center border-b border-slate-100 hover:bg-slate-50 transition-colors" style={{ height: 48 }}>
              {/* Label */}
              <div style={{ width: LABEL_COL, minWidth: LABEL_COL }} className="flex-shrink-0 px-3 border-r border-slate-100">
                <p className="text-sm font-medium text-slate-800 line-clamp-1">{project.title}</p>
                {project.sector && (
                  <span
                    className="text-[9px] font-medium px-1 py-0.5 rounded"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {project.sector.name}
                  </span>
                )}
              </div>

              {/* Timeline track */}
              <div className="flex flex-1 relative" style={{ height: 48 }}>
                {weeks.map((w) => (
                  <div
                    key={w.toISOString()}
                    style={{ width: WEEK_COL, minWidth: WEEK_COL }}
                    className="border-r border-slate-100 h-full"
                  />
                ))}

                {/* Bar */}
                {startCol >= 0 && endCol > startCol && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 rounded-md flex items-center px-2"
                    style={{
                      left: startCol * WEEK_COL,
                      width: (endCol - startCol) * WEEK_COL - 4,
                      height: 28,
                      backgroundColor: delayed ? '#fef2f2' : `${color}22`,
                      border: `1.5px solid ${delayed ? '#f87171' : color}`,
                    }}
                  >
                    <span
                      className="text-[10px] font-medium truncate"
                      style={{ color: delayed ? '#ef4444' : color }}
                    >
                      {delayed && '⚠ '}
                      {project.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded-sm bg-indigo-100 border border-indigo-400" />
          Em andamento
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded-sm bg-red-50 border border-red-400" />
          Atrasado
        </div>
      </div>
    </div>
  )
}

function buildGantt(projects: Project[]) {
  const dated = projects.filter((p) => p.start_date || p.expected_date || p.created_at)
  if (!dated.length) return { weeks: [], rows: [] }

  const allDates: Date[] = []
  for (const p of dated) {
    if (p.start_date) allDates.push(new Date(p.start_date))
    if (p.expected_date) allDates.push(new Date(p.expected_date))
    allDates.push(new Date(p.created_at))
  }

  const rangeStart = startOfWeek(min(allDates), { weekStartsOn: 1 })
  const rangeEnd = addWeeks(max(allDates), 1)

  const weeks: Date[] = []
  let cur = rangeStart
  while (isBefore(cur, rangeEnd)) {
    weeks.push(cur)
    cur = addWeeks(cur, 1)
  }

  const rows = dated.map((project) => {
    const barStart = new Date(project.start_date ?? project.created_at)
    const barEnd = project.expected_date
      ? new Date(project.expected_date)
      : addDays(barStart, 7)

    const startCol = Math.max(0, differenceInDays(startOfWeek(barStart, { weekStartsOn: 1 }), rangeStart) / 7)
    const endCol = Math.ceil(differenceInDays(barEnd, rangeStart) / 7)

    return { project, startCol: Math.floor(startCol), endCol: Math.max(endCol, startCol + 1) }
  })

  return { weeks, rows }
}
