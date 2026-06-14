'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { createTeam, updateTeam, deleteTeam } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'
import type { Team } from '@/lib/types'

interface Props { teams: Team[] }

export function TeamsSettings({ teams }: Props) {
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [createState, createAction, createPending] = useActionState(createTeam, null)

  useEffect(() => {
    if (createState?.success) setCreating(false)
  }, [createState])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Times</h2>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="size-3.5" /> Novo time
        </Button>
      </div>

      {creating && (
        <form action={createAction} className="flex flex-col gap-2 bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-lg p-3">
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-xs">Nome *</Label>
              <Input name="name" placeholder="Ex: Desenvolvimento" autoFocus required className="h-8 text-sm" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Descrição</Label>
            <Input name="description" placeholder="Descrição do time" className="h-8 text-sm" />
          </div>
          <div className="flex gap-2 justify-end">
            {createState?.error && <p className="text-xs text-red-500 self-center flex-1">{createState.error}</p>}
            <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}><X className="size-3.5" /></Button>
            <Button type="submit" size="sm" disabled={createPending}><Check className="size-3.5" /> Salvar</Button>
          </div>
        </form>
      )}

      <ul className="divide-y divide-slate-100 dark:divide-white/5">
        {teams.map((t) => (
          <TeamRow
            key={t.id}
            team={t}
            editing={editId === t.id}
            onEdit={() => setEditId(t.id)}
            onCancelEdit={() => setEditId(null)}
          />
        ))}
      </ul>
    </section>
  )
}

function TeamRow({ team, editing, onEdit, onCancelEdit }: {
  team: Team; editing: boolean; onEdit: () => void; onCancelEdit: () => void
}) {
  const [updateState, updateAction, updatePending] = useActionState(updateTeam, null)
  const [, deleteAction] = useActionState(deleteTeam, null)

  useEffect(() => {
    if (updateState?.success) onCancelEdit()
  }, [updateState, onCancelEdit])

  if (editing) {
    return (
      <li className="py-2 flex flex-col gap-2">
        <form action={updateAction} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={team.id} />
          <Input name="name" defaultValue={team.name} required className="h-8 text-sm" autoFocus />
          <Input name="description" defaultValue={team.description ?? ''} placeholder="Descrição" className="h-8 text-sm" />
          <div className="flex justify-end gap-1">
            <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}><X className="size-3.5" /></Button>
            <Button type="submit" size="sm" disabled={updatePending}><Check className="size-3.5" /></Button>
          </div>
        </form>
        {updateState?.error && <p className="text-xs text-red-500">{updateState.error}</p>}
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 py-2.5 group">
      <div className="flex-1">
        <p className="text-sm text-slate-700 dark:text-slate-300">{team.name}</p>
        {team.description && <p className="text-xs text-slate-400">{team.description}</p>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="size-7 p-0" onClick={onEdit}><Pencil className="size-3" /></Button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={team.id} />
          <Button type="submit" size="sm" variant="ghost" className="size-7 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="size-3" />
          </Button>
        </form>
      </div>
    </li>
  )
}
