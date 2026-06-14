import { Suspense } from 'react'
import { getProjects } from '@/lib/queries/projects'
import { getStatuses, getSectors, getTeams, getPriorities, getProfiles } from '@/lib/queries/settings'
import { Header } from '@/components/layout/header'
import { ProjectsView } from './projects-view'
import { Skeleton } from '@/components/ui/skeleton'

async function ProjectsContent() {
  const [projects, statuses, sectors, teams, priorities, profiles] = await Promise.all([
    getProjects({ completed: false }),
    getStatuses('project'),
    getSectors(),
    getTeams(),
    getPriorities(),
    getProfiles(),
  ])

  const defaultStatusId = statuses[0]?.id ?? ''

  return (
    <ProjectsView
      projects={projects}
      statuses={statuses}
      sectors={sectors}
      teams={teams}
      priorities={priorities}
      profiles={profiles}
      defaultStatusId={defaultStatusId}
    />
  )
}

export default function ProjectsPage() {
  return (
    <>
      <Header title="Projetos" />
      <div className="flex-1 overflow-hidden p-6 flex flex-col gap-4">
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <ProjectsContent />
        </Suspense>
      </div>
    </>
  )
}
