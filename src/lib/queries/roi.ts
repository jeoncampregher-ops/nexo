import { createClient } from '@/lib/supabase/server'
import type { BenefitType } from '@/lib/types'

export interface RoiProject {
  id: string
  title: string
  estimated_hours: number | null
  completed_at: string | null
  status: { name: string; color: string; is_final: boolean } | null
  sector: { name: string; color: string } | null
  request: {
    roi_value: number | null
    benefit_type: BenefitType | null
    current_process_cost: number
    cost_reduction_pct: number
    people_impacted: number
    hours_saved_per_person: number
  } | null
}

export interface RoiConfig {
  hourly_rate: number
  overhead_multiplier: number
}

export async function getProjectsForRoi(): Promise<{ projects: RoiProject[]; roiConfig: RoiConfig | null }> {
  const supabase = await createClient()

  const [{ data: projects }, { data: roiCfg }] = await Promise.all([
    supabase
      .from('projects')
      .select(`
        id, title, estimated_hours, completed_at,
        status:statuses(name, color, is_final),
        sector:sectors(name, color),
        request:requests!projects_request_id_fkey(
          roi_value, benefit_type,
          current_process_cost, cost_reduction_pct,
          people_impacted, hours_saved_per_person
        )
      `)
      .order('created_at', { ascending: false }),
    supabase.from('roi_config').select('hourly_rate, overhead_multiplier').single(),
  ])

  return {
    projects: (projects ?? []) as unknown as RoiProject[],
    roiConfig: roiCfg ?? null,
  }
}
