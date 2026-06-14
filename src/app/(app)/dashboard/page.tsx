import { Suspense } from 'react'
import { getDashboardMetrics } from '@/lib/queries/dashboard'
import { Header } from '@/components/layout/header'
import { MetricCard } from '@/components/shared/metric-card'
import { ThroughputChart } from '@/components/dashboard/throughput-chart'
import { SectorChart } from '@/components/dashboard/sector-chart'
import { StatusChart } from '@/components/dashboard/status-chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import {
  FolderKanban,
  Play,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Clock,
  TrendingUp,
} from 'lucide-react'

async function DashboardContent() {
  const m = await getDashboardMetrics()

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      {/* Row 1 — 4 KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de projetos"
          value={m.total_projects}
          icon={FolderKanban}
          iconColor="text-indigo-500 dark:text-indigo-400"
        />
        <MetricCard
          title="Em andamento"
          value={m.active_projects}
          icon={Play}
          iconColor="text-blue-500 dark:text-blue-400"
        />
        <MetricCard
          title="Atrasados"
          value={m.delayed_projects}
          subtitle="além da data esperada"
          icon={AlertTriangle}
          iconColor="text-red-500 dark:text-red-400"
          className="border-red-200 dark:border-red-500/15"
        />
        <MetricCard
          title="Concluídos no mês"
          value={m.completed_this_month}
          icon={CheckCircle2}
          iconColor="text-emerald-500 dark:text-emerald-400"
          className="border-emerald-200 dark:border-emerald-500/15"
        />
      </div>

      {/* Row 2 — 3 KPIs com ROI em destaque */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Pedidos pendentes"
          value={m.pending_requests}
          subtitle="aguardando aprovação"
          icon={Inbox}
          iconColor="text-amber-500 dark:text-amber-400"
        />
        <MetricCard
          title="Lead time médio"
          value={`${m.avg_lead_time_days}d`}
          subtitle="da abertura à entrega"
          icon={Clock}
          iconColor="text-slate-500 dark:text-slate-400"
        />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-5 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/6 to-transparent pointer-events-none" />
          <div className="relative flex items-start justify-between">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ROI total gerado</p>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <TrendingUp className="size-4 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <div className="relative">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight leading-none">
              {formatCurrency(m.total_roi)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">em projetos concluídos</p>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/6 p-6">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5">
            Throughput — entregas por semana
          </p>
          <ThroughputChart data={m.throughput_by_week} />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/6 p-6">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Por status
          </p>
          <StatusChart data={m.projects_by_status} />
        </div>
      </div>

      {/* Sector chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/6 p-6">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5">
          Projetos por setor
        </p>
        <SectorChart data={m.projects_by_sector} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  )
}
