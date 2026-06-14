import { createClient } from '@/lib/supabase/server'
import type { Project, ProjectHistory } from '@/lib/types'

const PROJECT_SELECT = `
  *,
  sector:sectors(*),
  requester:profiles!projects_requester_id_fkey(*),
  assignee:profiles!projects_assignee_id_fkey(*),
  team:teams(*),
  status:statuses(*),
  priority:priorities(*)
`

export async function getProjects(filters?: { statusId?: string; completed?: boolean }): Promise<Project[]> {
  const supabase = await createClient()
  let query = supabase.from('projects').select(PROJECT_SELECT).order('kanban_position')

  if (filters?.completed === true) {
    query = query.not('completed_at', 'is', null)
  } else if (filters?.completed === false) {
    query = query.is('completed_at', null)
  }

  if (filters?.statusId) {
    query = query.eq('status_id', filters.statusId)
  }

  const { data } = await query
  return data ?? []
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('id', id)
    .single()
  return data
}

export async function getProjectHistory(projectId: string): Promise<ProjectHistory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('project_history')
    .select('*, user:profiles(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  return data ?? []
}
