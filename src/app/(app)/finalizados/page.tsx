import { Suspense } from 'react'
import { getProjects } from '@/lib/queries/projects'
import { getStatuses } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/shared/status-badge'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatDate, leadTimeDays } from '@/lib/utils'
import { CheckCircle2, Clock } from 'lucide-react'

async function FinalizadosContent() {
  const [projects, statuses] = await Promise.all([
    getProjects(),
    getStatuses('project'),
  ])

  const finalStatusIds = new Set(statuses.filter((s) => s.is_final).map((s) => s.id))
  const finished = projects.filter((p) => finalStatusIds.has(p.status_id))

  if (!finished.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <CheckCircle2 className="size-10 opacity-40" />
        <p className="text-sm">Nenhum projeto finalizado ainda.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/8 text-left text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <th className="pb-3 pr-4 font-medium">Projeto</th>
            <th className="pb-3 pr-4 font-medium">Setor</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Prioridade</th>
            <th className="pb-3 pr-4 font-medium">Responsável</th>
            <th className="pb-3 pr-4 font-medium">Lead time</th>
            <th className="pb-3 font-medium">Concluído em</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {finished.map((project) => {
            const lt = leadTimeDays(project.created_at, project.completed_at)
            return (
              <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                <td className="py-3 pr-4">
                  <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{project.title}</p>
                  {project.description && (
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{project.description}</p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {project.sector ? (
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${project.sector.color}18`, color: project.sector.color }}
                    >
                      {project.sector.name}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4">
                  {project.status ? <StatusBadge status={project.status} /> : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4">
                  {project.priority ? <PriorityBadge priority={project.priority} size="sm" /> : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4">
                  {project.assignee ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar user={project.assignee} size="sm" />
                      <span className="text-slate-600 text-xs">{project.assignee.full_name}</span>
                    </div>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4">
                  {lt != null ? (
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="size-3 text-slate-400" />
                      {lt}d
                    </div>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 text-slate-500">
                  {project.completed_at ? formatDate(project.completed_at) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-6 flex items-center gap-6 text-sm text-slate-500 border-t border-slate-100 dark:border-white/8 pt-4">
        <span>{finished.length} projeto{finished.length !== 1 ? 's' : ''} finalizado{finished.length !== 1 ? 's' : ''}</span>
        {finished.length > 0 && (() => {
          const withLt = finished.map((p) => leadTimeDays(p.created_at, p.completed_at)).filter((d): d is number => d != null)
          if (!withLt.length) return null
          const avg = Math.round(withLt.reduce((a, b) => a + b, 0) / withLt.length)
          return <span>Lead time médio: <strong className="text-slate-700">{avg} dias</strong></span>
        })()}
      </div>
    </div>
  )
}

export default function FinalizadosPage() {
  return (
    <>
      <Header title="Finalizados" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/6 p-6">
          <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
            <FinalizadosContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
