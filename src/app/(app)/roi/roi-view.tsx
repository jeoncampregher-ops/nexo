'use client'

import { useMemo } from 'react'
import { calcProjectRoi } from '@/lib/roi'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import type { RoiProject, RoiConfig } from '@/lib/queries/roi'
import type { BenefitType } from '@/lib/types'

interface Props {
  projects: RoiProject[]
  roiConfig: RoiConfig | null
}

const BENEFIT_LABELS: Record<BenefitType, string> = {
  cost_reduction:   'Redução de custo',
  revenue_increase: 'Aumento de receita',
  compliance:       'Conformidade',
  quality:          'Qualidade / Risco',
}

const BENEFIT_COLORS: Record<BenefitType, string> = {
  cost_reduction:   'bg-blue-50 text-blue-700 ring-blue-200',
  revenue_increase: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  compliance:       'bg-amber-50 text-amber-700 ring-amber-200',
  quality:          'bg-purple-50 text-purple-700 ring-purple-200',
}

function SummaryCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: 'green' | 'red' | 'blue' | 'default'
}) {
  const colors = {
    green:   'text-emerald-600',
    red:     'text-red-500',
    blue:    'text-indigo-600',
    default: 'text-slate-800',
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex flex-col gap-1">
      <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={cn('text-2xl font-bold leading-none', colors[accent ?? 'default'])}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  )
}

export function RoiView({ projects, roiConfig }: Props) {
  const rows = useMemo(() => {
    if (!roiConfig) return []

    return projects.map((p) => {
      const monthly = p.request?.roi_value ?? null
      const hours = p.estimated_hours

      if (monthly == null || !hours) {
        return { project: p, roi: null, missing: !hours ? 'horas' : 'pedido' as 'horas' | 'pedido' }
      }

      const roi = calcProjectRoi(monthly, hours, roiConfig.hourly_rate, roiConfig.overhead_multiplier)
      return { project: p, roi, missing: null }
    })
  }, [projects, roiConfig])

  const complete = rows.filter((r) => r.roi != null)
  const totalAnnual = complete.reduce((s, r) => s + (r.roi?.annualSavings ?? 0), 0)
  const totalDevCost = complete.reduce((s, r) => s + (r.roi?.devCost ?? 0), 0)
  const avgRoi = complete.length > 0
    ? complete.reduce((s, r) => s + (r.roi?.roiPct ?? 0), 0) / complete.length
    : null
  const avgPayback = complete.filter((r) => r.roi?.paybackMonths != null).length > 0
    ? complete.filter((r) => r.roi?.paybackMonths != null)
        .reduce((s, r) => s + (r.roi!.paybackMonths!), 0) /
      complete.filter((r) => r.roi?.paybackMonths != null).length
    : null

  if (!roiConfig) {
    return (
      <div className="p-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-800">Configure o custo/hora em <a href="/configuracoes" className="font-semibold underline">Configurações → ROI</a> para ativar os cálculos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          label="Projetos com ROI"
          value={`${complete.length} / ${projects.length}`}
          sub="com dados completos"
          accent="blue"
        />
        <SummaryCard
          label="Economia anual total"
          value={totalAnnual > 0 ? formatCurrency(totalAnnual) : '—'}
          sub="projetada (1 ano)"
          accent="green"
        />
        <SummaryCard
          label="ROI médio"
          value={avgRoi != null ? `${Math.round(avgRoi)}%` : '—'}
          sub="sobre custo de dev"
          accent={avgRoi != null ? (avgRoi >= 0 ? 'green' : 'red') : 'default'}
        />
        <SummaryCard
          label="Payback médio"
          value={avgPayback != null ? `${Math.round(avgPayback * 10) / 10} meses` : '—'}
          sub="até retorno do investimento"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Projeto</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">Custo dev</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">Economia/mês</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">Economia/ano</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">ROI %</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">Payback</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Benefício</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                  Nenhum projeto ainda. Crie projetos vinculados a pedidos para ver o ROI.
                </td>
              </tr>
            ) : rows.map(({ project, roi, missing }) => (
              <tr key={project.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Projeto */}
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-slate-800 max-w-[200px] truncate">{project.title}</p>
                  {project.sector && (
                    <span className="text-[10px] font-medium" style={{ color: project.sector.color }}>
                      {project.sector.name}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {project.status ? (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1"
                      style={{
                        backgroundColor: `${project.status.color}18`,
                        color: project.status.color,
                        ['--tw-ring-color' as string]: `${project.status.color}40`,
                      }}
                    >
                      {project.completed_at ? <CheckCircle2 className="size-2.5" /> : <Clock className="size-2.5" />}
                      {project.status.name}
                    </span>
                  ) : '—'}
                </td>

                {/* Custo dev */}
                <td className="px-4 py-3 text-right">
                  {roi ? (
                    <span className="text-[13px] font-medium text-slate-700">{formatCurrency(roi.devCost)}</span>
                  ) : missing === 'horas' ? (
                    <span className="text-[11px] text-amber-500 flex items-center justify-end gap-1">
                      <AlertCircle className="size-3" /> sem horas
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Economia mensal */}
                <td className="px-4 py-3 text-right">
                  {roi ? (
                    <span className="text-[13px] font-medium text-emerald-600">{formatCurrency(roi.monthlySavings)}</span>
                  ) : missing === 'pedido' ? (
                    <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                      <Minus className="size-3" /> sem pedido
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Economia anual */}
                <td className="px-4 py-3 text-right">
                  {roi ? (
                    <span className="text-[13px] font-semibold text-emerald-600">{formatCurrency(roi.annualSavings)}</span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* ROI % */}
                <td className="px-4 py-3 text-right">
                  {roi ? (
                    <span className={cn(
                      'inline-flex items-center gap-0.5 text-[13px] font-bold',
                      roi.roiPct >= 0 ? 'text-emerald-600' : 'text-red-500'
                    )}>
                      {roi.roiPct >= 0
                        ? <TrendingUp className="size-3.5" />
                        : <TrendingDown className="size-3.5" />}
                      {roi.roiPct}%
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Payback */}
                <td className="px-4 py-3 text-right">
                  {roi?.paybackMonths != null ? (
                    <span className="text-[13px] font-medium text-slate-700">
                      {roi.paybackMonths} meses
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Tipo de benefício */}
                <td className="px-4 py-3">
                  {project.request?.benefit_type ? (
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full ring-1',
                      BENEFIT_COLORS[project.request.benefit_type]
                    )}>
                      {BENEFIT_LABELS[project.request.benefit_type]}
                    </span>
                  ) : <span className="text-slate-300 text-[11px]">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400">
        Custo dev = horas estimadas × R${roiConfig.hourly_rate}/h × {roiConfig.overhead_multiplier}× overhead.
        Configure em <a href="/configuracoes" className="underline hover:text-slate-600">Configurações → ROI</a>.
      </p>
    </div>
  )
}
