'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { getAuthContext } from './auth-context'

// --- Sectors ---

const SectorSchema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

export async function createSector(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const parsed = SectorSchema.safeParse({ name: formData.get('name'), color: formData.get('color') })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('sectors').insert({ ...parsed.data, org_id: ctx.org_id })
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function updateSector(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const parsed = SectorSchema.safeParse({ name: formData.get('name'), color: formData.get('color') })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('sectors').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function deleteSector(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('sectors').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

// --- Teams ---

const TeamSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

export async function createTeam(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const parsed = TeamSchema.safeParse({ name: formData.get('name'), description: formData.get('description') || undefined })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('teams').insert({ ...parsed.data, org_id: ctx.org_id })
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function updateTeam(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const parsed = TeamSchema.safeParse({ name: formData.get('name'), description: formData.get('description') || undefined })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('teams').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function deleteTeam(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('teams').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

// --- Statuses ---

const StatusSchema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  applies_to: z.enum(['request', 'project', 'both']),
  position: z.coerce.number().int().min(0),
  is_final: z.coerce.boolean().default(false),
})

export async function createStatus(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const parsed = StatusSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    applies_to: formData.get('applies_to'),
    position: formData.get('position'),
    is_final: formData.get('is_final') === 'true',
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('statuses').insert({ ...parsed.data, org_id: ctx.org_id })
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function updateStatus(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const parsed = StatusSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    applies_to: formData.get('applies_to'),
    position: formData.get('position'),
    is_final: formData.get('is_final') === 'true',
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('statuses').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function deleteStatus(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('statuses').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

// --- Priorities ---

const PrioritySchema = z.object({
  name: z.string().min(2),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  level: z.coerce.number().int().min(1),
  sla_days: z.coerce.number().int().positive().optional().nullable(),
})

export async function createPriority(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const parsed = PrioritySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    level: formData.get('level'),
    sla_days: formData.get('sla_days') || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase.from('priorities').insert({ ...parsed.data, org_id: ctx.org_id })
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function updatePriority(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID inválido' }

  const parsed = PrioritySchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
    level: formData.get('level'),
    sla_days: formData.get('sla_days') || null,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('priorities').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function deletePriority(_prev: unknown, formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { error } = await supabase.from('priorities').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

// --- ROI Config ---

const RoiConfigSchema = z.object({
  hourly_rate: z.coerce.number().positive(),
  overhead_multiplier: z.coerce.number().positive(),
})

export async function updateRoiConfig(_prev: unknown, formData: FormData) {
  const ctx = await getAuthContext()
  if (!ctx) return { error: 'Não autenticado' }

  const parsed = RoiConfigSchema.safeParse({
    hourly_rate: formData.get('hourly_rate'),
    overhead_multiplier: formData.get('overhead_multiplier'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await ctx.supabase
    .from('roi_config')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('org_id', ctx.org_id)

  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

// --- Users ---

export async function updateUserRole(_prev: unknown, formData: FormData) {
  const userId = formData.get('user_id') as string
  const role = formData.get('role') as string

  const z_role = z.enum(['admin', 'gestor', 'dev', 'solicitante']).safeParse(role)
  if (!z_role.success) return { error: 'Role inválido' }

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ role: z_role.data }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}

export async function toggleUserActive(_prev: unknown, formData: FormData) {
  const userId = formData.get('user_id') as string
  const active = formData.get('active') === 'true'

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ active }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/configuracoes')
  return { success: true }
}
