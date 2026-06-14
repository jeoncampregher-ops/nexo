'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Sector, Team, Status, Priority, Profile } from '@/lib/types'

interface Props {
  defaultStatusId: string
  sectors: Sector[]
  teams: Team[]
  priorities: Priority[]
  profiles: Profile[]
}

export function NewProjectForm({ defaultStatusId, sectors, teams, priorities, profiles }: Props) {
  const [state, action, pending] = useActionState(createProject, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) router.push('/projetos')
  }, [state, router])

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="status_id" value={defaultStatusId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título *</Label>
        <Input id="title" name="title" placeholder="Nome do projeto" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" placeholder="Descreva o objetivo do projeto…" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Setor</Label>
          <Select name="sector_id">
            <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
            <SelectContent>
              {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Prioridade</Label>
          <Select name="priority_id">
            <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
            <SelectContent>
              {priorities.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Responsável</Label>
          <Select name="assignee_id">
            <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
            <SelectContent>
              {profiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Time</Label>
          <Select name="team_id">
            <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
            <SelectContent>
              {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="estimated_hours">Horas estimadas</Label>
          <Input id="estimated_hours" name="estimated_hours" type="number" min="0" step="0.5" placeholder="Ex: 40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expected_date">Data de entrega</Label>
          <Input id="expected_date" name="expected_date" type="date" />
        </div>
      </div>

      {state?.error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={pending}>
          {pending ? 'Criando…' : 'Criar projeto'}
        </Button>
      </div>
    </form>
  )
}
