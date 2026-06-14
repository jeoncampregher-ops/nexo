import { createClient } from '@/lib/supabase/server'
import type { Sector, Team, Status, Priority, FormField, RoiConfig, Profile } from '@/lib/types'

export async function getSectors(): Promise<Sector[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('sectors').select('*').order('name')
  return data ?? []
}

export async function getTeams(): Promise<Team[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('teams').select('*').order('name')
  return data ?? []
}

export async function getStatuses(appliesTo?: 'request' | 'project'): Promise<Status[]> {
  const supabase = await createClient()
  let query = supabase.from('statuses').select('*').order('position')
  if (appliesTo) query = query.in('applies_to', [appliesTo, 'both'])
  const { data } = await query
  return data ?? []
}

export async function getPriorities(): Promise<Priority[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('priorities').select('*').order('level')
  return data ?? []
}

export async function getFormFields(): Promise<FormField[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('form_fields')
    .select('*')
    .eq('active', true)
    .order('position')
  return data ?? []
}

export async function getRoiConfig(): Promise<RoiConfig | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('roi_config').select('*').single()
  return data
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*, team:teams(*)')
    .eq('active', true)
    .order('full_name')
  return data ?? []
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('*, team:teams(*)')
    .eq('id', user.id)
    .single()
  return data
}
