import { createClient } from '@/lib/supabase/server'
import { isAfter, parseISO, startOfWeek, format, subWeeks } from 'date-fns'
import type { DashboardMetrics, Project } from '@/lib/types'

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  const [{ data: projects }, { data: requests }, { data: statuses }, { data: sectors }] =
    await Promise.all([
      supabase.from('projects').select('*, status:statuses(*), sector:sectors(*), priority:priorities(*)'),
      supabase.from('requests').select('*, status:statuses(*)').is('project_id', null),
      supabase.from('statuses').select('*').in('applies_to', ['project', 'both']),
      supabase.from('sectors').select('*'),
    ])

  const now = new Date()
  const allProjects: Project[] = projects ?? []

  const active = allProjects.filter((p) => !p.completed_at)
  const completed = allProjects.filter((p) => !!p.completed_at)

  const delayed = active.filter(
    (p) => p.expected_date && isAfter(now, parseISO(p.expected_date))
  )

  const thisMonth = completed.filter((p) => {
    if (!p.completed_at) return false
    const d = parseISO(p.completed_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const completedWithTime = completed.filter((p) => p.completed_at)
  const avgLeadTime =
    completedWithTime.length > 0
      ? completedWithTime.reduce((sum, p) => {
          const days = Math.ceil(
            (new Date(p.completed_at!).getTime() - new Date(p.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          )
          return sum + days
        }, 0) / completedWithTime.length
      : 0

  const throughputByWeek = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(now, 7 - i), { weekStartsOn: 1 })
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    const count = completed.filter((p) => {
      if (!p.completed_at) return false
      const d = parseISO(p.completed_at)
      return d >= weekStart && d <= weekEnd
    }).length
    return { week: format(weekStart, 'dd/MM'), count }
  })

  const statusMap = new Map((statuses ?? []).map((s) => [s.id, s]))
  const sectorMap = new Map((sectors ?? []).map((s) => [s.id, s]))

  const projectsByStatus = (statuses ?? [])
    .filter((s) => s.applies_to !== 'request')
    .map((s) => ({
      status: s.name,
      color: s.color,
      count: allProjects.filter((p) => p.status_id === s.id).length,
    }))

  const projectsBySector = Array.from(
    allProjects.reduce((map, p) => {
      if (!p.sector_id) return map
      const sector = sectorMap.get(p.sector_id)
      if (!sector) return map
      map.set(p.sector_id, { sector: sector.name, color: sector.color, count: (map.get(p.sector_id)?.count ?? 0) + 1 })
      return map
    }, new Map<string, { sector: string; color: string; count: number }>())
  ).map(([, v]) => v)

  const totalRoi = allProjects.reduce((sum, p) => sum + (p.roi_value ?? 0), 0)

  return {
    total_projects: allProjects.length,
    active_projects: active.length,
    delayed_projects: delayed.length,
    completed_this_month: thisMonth.length,
    pending_requests: (requests ?? []).length,
    avg_lead_time_days: Math.round(avgLeadTime),
    throughput_by_week: throughputByWeek,
    projects_by_sector: projectsBySector,
    projects_by_status: projectsByStatus,
    total_roi: totalRoi,
  }
}
