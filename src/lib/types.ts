export type Role = 'admin' | 'gestor' | 'dev' | 'solicitante'
export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox'
export type AppliesTo = 'request' | 'project' | 'both'

export interface Organization {
  id: string
  name: string
  created_at: string
}

export interface Sector {
  id: string
  org_id: string
  name: string
  color: string
  active: boolean
  created_at: string
}

export interface Team {
  id: string
  org_id: string
  name: string
  description: string | null
  active: boolean
  created_at: string
}

export interface Profile {
  id: string
  org_id: string
  email: string
  full_name: string
  role: Role
  team_id: string | null
  avatar_url: string | null
  active: boolean
  created_at: string
  updated_at: string
  team?: Team
}

export interface Status {
  id: string
  org_id: string
  name: string
  color: string
  applies_to: AppliesTo
  position: number
  is_final: boolean
  created_at: string
}

export interface Priority {
  id: string
  org_id: string
  name: string
  color: string
  level: number
  sla_days: number | null
  created_at: string
}

export interface FormField {
  id: string
  org_id: string
  label: string
  field_type: FieldType
  placeholder: string | null
  options: { label: string; value: string }[] | null
  required: boolean
  position: number
  active: boolean
  created_at: string
}

export interface RoiConfig {
  id: string
  org_id: string
  hourly_rate: number
  overhead_multiplier: number
  updated_at: string
}

export type BenefitType = 'cost_reduction' | 'revenue_increase' | 'compliance' | 'quality'

export interface Request {
  id: string
  org_id: string
  title: string
  description: string | null
  sector_id: string | null
  requester_id: string
  status_id: string | null
  priority_id: string | null
  form_data: Record<string, unknown>
  // ROI inputs (preenchidos pelo solicitante)
  benefit_type: BenefitType | null
  current_process_cost: number
  cost_reduction_pct: number
  people_impacted: number
  hours_saved_per_person: number
  roi_value: number | null  // economia mensal calculada
  expected_date: string | null
  kanban_position: number
  approved_by: string | null
  approved_at: string | null
  rejected_reason: string | null
  project_id: string | null
  created_at: string
  updated_at: string
  sector?: Sector
  requester?: Profile
  status?: Status
  priority?: Priority
  approver?: Profile
}

export interface ProjectAnalysis {
  problem_analysis?: string
  direct_gain?: string
  indirect_gain?: string
  technical_analysis?: string
}

export interface Project {
  id: string
  org_id: string
  title: string
  description: string | null
  sector_id: string | null
  requester_id: string | null
  assignee_id: string | null
  team_id: string | null
  status_id: string
  priority_id: string | null
  request_id: string | null
  estimated_hours: number | null
  actual_hours: number | null
  roi_value: number | null
  start_date: string | null
  expected_date: string | null
  homologation_date: string | null
  completed_at: string | null
  kanban_position: number
  tags: string[]
  analysis: ProjectAnalysis | null
  created_at: string
  updated_at: string
  sector?: Sector
  requester?: Profile
  assignee?: Profile
  team?: Team
  status?: Status
  priority?: Priority
}

export interface ProjectHistory {
  id: string
  project_id: string
  changed_by: string
  field_changed: string
  old_value: string | null
  new_value: string
  notes: string | null
  created_at: string
  user?: Profile
}

export interface DashboardMetrics {
  total_projects: number
  active_projects: number
  delayed_projects: number
  completed_this_month: number
  pending_requests: number
  avg_lead_time_days: number
  throughput_by_week: { week: string; count: number }[]
  projects_by_sector: { sector: string; count: number; color: string }[]
  projects_by_status: { status: string; count: number; color: string }[]
  total_roi: number
}
