import { Suspense } from 'react'
import { getProjects } from '@/lib/queries/projects'
import { Header } from '@/components/layout/header'
import { GanttChart } from '@/components/gantt/gantt-chart'
import { Skeleton } from '@/components/ui/skeleton'

async function GanttContent() {
  const projects = await getProjects()
  return <GanttChart projects={projects} />
}

export default function GanttPage() {
  return (
    <>
      <Header title="Gantt" />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/6 p-6">
          <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
            <GanttContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
