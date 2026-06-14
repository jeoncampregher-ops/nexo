'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { calcMonthlySavings } from '@/lib/roi'
import { getAuthContext } from './auth-context'

const RequestSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().optional(),
  sector_id: z.string().uuid().optional().nullable(),
  status_id: z.string().uuid(),
  priority_id: z.string().uuid().optional().nullable(),
  expected_date: z.string().optional().nullable(),
  benefit_type: z.enum(['cost_reduction', 'revenue_increase', 'compliance', 'quality']).optional().nullable(),
  current_process_cost: z.coerce.number().min(0).default(0),
  cost_reduction_pct: z.coerce.number().min(0).max(100).default(0),
  people_impacted: z.coerce.number().int().min(0).default(0),
  hours_saved_per_person: z.coerce.number().min(0).default(0),
  form_data: z.record(z.string(), z.unknown()).default({}),
})

export async function createRequest(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const rawFormData: Record<string, unknown> = {}
  formData.forEach((value, key) => {
    if (!(key in RequestSchema.shape)) rawFormData[key] = value
  })

  const parsed = RequestSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    sector_id: formData.get('sector_id') || null,
    status_id: formData.get('status_id'),
    priority_id: formData.get('priority_id') || null,
    expected_date: formData.get('expected_date') || null,
    benefit_type: formData.get('benefit_type') || null,
    current_process_cost: formData.get('current_process_cost') || 0,
    cost_reduction_pct: formData.get('cost_reduction_pct') || 0,
    people_impacted: formData.get('people_impacted') || 0,
    hours_saved_per_person: formData.get('hours_saved_per_person') || 0,
    form_data: rawFormData,
  })

  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: roiCfg } = await ctx.supabase.from('roi_config').select('hourly_rate').single()

  const monthly_savings = calcMonthlySavings({
    currentProcessCost: parsed.data.current_process_cost,
    costReductionPct: parsed.data.cost_reduction_pct,
    peopleImpacted: parsed.data.people_impacted,
    hoursSavedPerPerson: parsed.data.hours_saved_per_person,
    hourlyRate: roiCfg?.hourly_rate ?? 0,
  })

  const { error } = await ctx.supabase.from('requests').insert({
    ...parsed.data,
    org_id: ctx.org_id,
    requester_id: ctx.user.id,
    roi_value: monthly_savings > 0 ? monthly_savings : null,
  })

  if (error) return { error: error.message }
  revalidatePath('/pedidos')
  return { success: true }
}

export async function updateRequestStatus(id: string, statusId: string, position?: number) {
  const supabase = await createClient()
  const update: Record<string, unknown> = { status_id: statusId }
  if (position !== undefined) update.kanban_position = position
  const { error } = await supabase.from('requests').update(update).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/pedidos')
  return { success: true }
}

export async function approveRequest(id: string, statusId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase.from('requests').update({
    status_id: statusId,
    approved_by: user.id,
    approved_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/pedidos')
  return { success: true }
}

export async function convertRequestToProject(requestId: string, defaultStatusId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: req } = await supabase.from('requests').select('*').eq('id', requestId).single()
  if (!req) return { error: 'Pedido não encontrado' }

  const { data: profileData } = await supabase.from('profiles').select('org_id').eq('id', user.id).single()
  const org_id = profileData?.org_id

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      org_id,
      title: req.title,
      description: req.description,
      sector_id: req.sector_id,
      requester_id: req.requester_id,
      status_id: defaultStatusId,
      priority_id: req.priority_id,
      expected_date: req.expected_date,
      roi_value: req.roi_value,
      request_id: requestId,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  await supabase.from('requests').update({ project_id: project.id }).eq('id', requestId)

  revalidatePath('/pedidos')
  revalidatePath('/projetos')
  return { success: true, projectId: project.id }
}

export async function updateRequestKanban(updates: { id: string; status_id: string | null; kanban_position: number }[]) {
  const supabase = await createClient()
  for (const u of updates) {
    await supabase.from('requests').update({ status_id: u.status_id, kanban_position: u.kanban_position }).eq('id', u.id)
  }
  revalidatePath('/pedidos')
  return { success: true }
}
