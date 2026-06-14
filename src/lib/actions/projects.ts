'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAuthContext } from './auth-context'

const ProjectSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().optional(),
  sector_id: z.string().uuid().optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  team_id: z.string().uuid().optional().nullable(),
  status_id: z.string().uuid('Status de projeto não configurado. Vá em Configurações → Status.'),
  priority_id: z.string().uuid().optional().nullable(),
  estimated_hours: z.coerce.number().positive().optional().nullable(),
  start_date: z.string().optional().nullable(),
  expected_date: z.string().optional().nullable(),
  homologation_date: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  roi_value: z.coerce.number().optional().nullable(),
  request_id: z.string().uuid().optional().nullable(),
  problem_analysis: z.string().optional(),
  direct_gain: z.string().optional(),
  indirect_gain: z.string().optional(),
  technical_analysis: z.string().optional(),
})

export async function createProject(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const statusId = formData.get('status_id') as string
  if (!statusId) {
    return { error: 'Nenhum status de projeto configurado. Acesse Configurações → Status e crie ao menos um status do tipo "projeto".' }
  }

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    sector_id: formData.get('sector_id') || null,
    assignee_id: formData.get('assignee_id') || null,
    team_id: formData.get('team_id') || null,
    status_id: formData.get('status_id'),
    priority_id: formData.get('priority_id') || null,
    estimated_hours: formData.get('estimated_hours') || null,
    start_date: formData.get('start_date') || null,
    expected_date: formData.get('expected_date') || null,
    homologation_date: formData.get('homologation_date') || null,
    roi_value: formData.get('roi_value') || null,
    request_id: formData.get('request_id') || null,
    problem_analysis: formData.get('problem_analysis') as string || undefined,
    direct_gain: formData.get('direct_gain') as string || undefined,
    indirect_gain: formData.get('indirect_gain') as string || undefined,
    technical_analysis: formData.get('technical_analysis') as string || undefined,
  })

  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { problem_analysis, direct_gain, indirect_gain, technical_analysis, ...rest } = parsed.data
  const analysis = { problem_analysis, direct_gain, indirect_gain, technical_analysis }

  const { error } = await ctx.supabase.from('projects').insert({
    ...rest,
    analysis,
    org_id: ctx.org_id,
    requester_id: ctx.user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/projetos')
  return { success: true }
}

export async function updateProject(id: string, data: Partial<z.infer<typeof ProjectSchema>>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: current } = await supabase.from('projects').select('status_id').eq('id', id).single()

  const { error } = await supabase.from('projects').update(data).eq('id', id)
  if (error) return { error: error.message }

  if (data.status_id && current && data.status_id !== current.status_id) {
    await supabase.from('project_history').insert({
      project_id: id,
      changed_by: user.id,
      field_changed: 'status',
      old_value: current.status_id,
      new_value: data.status_id,
    })
  }

  if (data.status_id) {
    const { data: status } = await supabase.from('statuses').select('is_final').eq('id', data.status_id).single()
    if (status?.is_final) {
      await supabase.from('projects').update({ completed_at: new Date().toISOString() }).eq('id', id)
    }
  }

  revalidatePath('/projetos')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateProjectKanban(updates: { id: string; status_id: string | null; kanban_position: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  for (const u of updates) {
    const { data: current } = await supabase.from('projects').select('status_id').eq('id', u.id).single()
    await supabase.from('projects').update({ status_id: u.status_id, kanban_position: u.kanban_position }).eq('id', u.id)

    if (current && u.status_id !== current.status_id) {
      await supabase.from('project_history').insert({
        project_id: u.id,
        changed_by: user.id,
        field_changed: 'status',
        old_value: current.status_id,
        new_value: u.status_id,
      })

      const { data: status } = await supabase.from('statuses').select('is_final').eq('id', u.status_id).single()
      if (status?.is_final) {
        await supabase.from('projects').update({ completed_at: new Date().toISOString() }).eq('id', u.id)
      }
    }
  }

  revalidatePath('/projetos')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/projetos')
  revalidatePath('/dashboard')
  return { success: true }
}
