import { createClient } from '@/lib/supabase/server'

export async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (profile?.org_id) return { user, supabase, org_id: profile.org_id as string }

  // Profile criado antes do schema ser aplicado — fallback para a única org existente
  const { data: org } = await supabase
    .from('organizations')
    .select('id')
    .limit(1)
    .single()

  if (!org?.id) return null

  return { user, supabase, org_id: org.id as string }
}
