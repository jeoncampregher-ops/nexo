import { Suspense } from 'react'
import { getProjectsForRoi } from '@/lib/queries/roi'
import { RoiView } from './roi-view'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'

async function RoiContent() {
  const { projects, roiConfig } = await getProjectsForRoi()
  return <RoiView projects={projects} roiConfig={roiConfig} />
}

export default function RoiPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-950 shrink-0">
        <div className="size-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center shrink-0">
          <TrendingUp className="size-4 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white leading-none mb-0.5">ROI por Projeto</h1>
          <p className="text-[11px] text-slate-400">Acompanhe o retorno sobre investimento de cada projeto em andamento</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={
          <div className="p-6 flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        }>
          <RoiContent />
        </Suspense>
      </div>
    </div>
  )
}
