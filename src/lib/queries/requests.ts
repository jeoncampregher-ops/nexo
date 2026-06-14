import { createClient } from '@/lib/supabase/server'
import type { Request } from '@/lib/types'

const REQUEST_SELECT = `
  *,
  sector:sectors(*),
  requester:profiles!requests_requester_id_fkey(*),
  status:statuses(*),
  priority:priorities(*),
  approver:profiles!requests_approved_by_fkey(*)
`

export async function getRequests(): Promise<Request[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('requests')
    .select(REQUEST_SELECT)
    .order('kanban_position')
  return data ?? []
}

export async function getRequestById(id: string): Promise<Request | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('requests')
    .select(REQUEST_SELECT)
    .eq('id', id)
    .single()
  return data
}
