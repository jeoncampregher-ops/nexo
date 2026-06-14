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
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de projetos"
          value={m.total_projects}
          icon={FolderKanban}
          iconColor="text-indigo-500"
        />
        <MetricCard
          title="Em andamento"
          value={m.active_projects}
          icon={Play}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Atrasados"
          value={m.delayed_projects}
          subtitle="além da data esperada"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <MetricCard
          title="Concluídos no mês"
          value={m.completed_this_month}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
        />
        <MetricCard
          title="Pedidos pendentes"
          value={m.pending_requests}
          subtitle="aguardando aprovação"
          icon={Inbox}
          iconColor="text-amber-500"
        />
        <MetricCard
          title="Lead time médio"
          value={`${m.avg_lead_time_days}d`}
          subtitle="da abertura à entrega"
          icon={Clock}
          iconColor="text-slate-500"
        />
        <MetricCard
          title="ROI total gerado"
          value={formatCurrency(m.total_roi)}
          subtitle="em projetos concluídos"
          icon={TrendingUp}
          iconColor="text-emerald-500"
          className="col-span-2"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Throughput — entregas por semana</p>
          <ThroughputChart data={m.throughput_by_week} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Por status</p>
          <StatusChart data={m.projects_by_status} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="text-sm font-semibold text-slate-700 mb-4">Projetos por setor</p>
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
    <div className="flex-1 p-6 flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Skeleton className="h-56 lg:col-span-2 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <Skeleton className="h-32 rounded-xl" />
    </div>
  )
}
