'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { createPriority, updatePriority, deletePriority } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'
import type { Priority } from '@/lib/types'

interface Props { priorities: Priority[] }

const LEVEL_ICON: Record<number, string> = { 1: '↓', 2: '→', 3: '↑', 4: '⚡' }

export function PrioritiesSettings({ priorities }: Props) {
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [createState, createAction, createPending] = useActionState(createPriority, null)

  useEffect(() => {
    if (createState?.success) setCreating(false)
  }, [createState])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Prioridades</h2>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="size-3.5" /> Nova prioridade
        </Button>
      </div>

      {creating && (
        <form action={createAction} className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Nome *</Label>
              <Input name="name" placeholder="Ex: Alta" autoFocus required className="h-8 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Cor</Label>
              <input name="color" type="color" defaultValue="#f59e0b" className="h-8 w-full rounded border border-slate-200 cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Nível (1–4)</Label>
              <Input name="level" type="number" min="1" max="4" defaultValue={priorities.length + 1} className="h-8 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">SLA (dias)</Label>
              <Input name="sla_days" type="number" min="1" placeholder="Opcional" className="h-8 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {createState?.error && <p className="text-xs text-red-500 self-center flex-1">{createState.error}</p>}
            <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}><X className="size-3.5" /></Button>
            <Button type="submit" size="sm" disabled={createPending}><Check className="size-3.5" /> Salvar</Button>
          </div>
        </form>
      )}

      <ul className="divide-y divide-slate-100">
        {priorities.map((p) => (
          <PriorityRow
            key={p.id}
            priority={p}
            editing={editId === p.id}
            onEdit={() => setEditId(p.id)}
            onCancelEdit={() => setEditId(null)}
          />
        ))}
      </ul>
    </section>
  )
}

function PriorityRow({ priority, editing, onEdit, onCancelEdit }: {
  priority: Priority; editing: boolean; onEdit: () => void; onCancelEdit: () => void
}) {
  const [updateState, updateAction, updatePending] = useActionState(updatePriority, null)
  const [, deleteAction] = useActionState(deletePriority, null)

  useEffect(() => {
    if (updateState?.success) onCancelEdit()
  }, [updateState, onCancelEdit])

  if (editing) {
    return (
      <li className="py-2">
        <form action={updateAction} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={priority.id} />
          <div className="grid grid-cols-2 gap-2">
            <Input name="name" defaultValue={priority.name} required className="h-8 text-sm" autoFocus />
            <input name="color" type="color" defaultValue={priority.color} className="h-8 w-full rounded border border-slate-200 cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input name="level" type="number" min="1" max="4" defaultValue={priority.level} className="h-8 text-sm" />
            <Input name="sla_days" type="number" min="1" defaultValue={priority.sla_days ?? ''} placeholder="SLA (dias)" className="h-8 text-sm" />
          </div>
          <div className="flex justify-end gap-1">
            <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}><X className="size-3.5" /></Button>
            <Button type="submit" size="sm" disabled={updatePending}><Check className="size-3.5" /></Button>
          </div>
        </form>
        {updateState?.error && <p className="text-xs text-red-500 mt-1">{updateState.error}</p>}
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 py-2.5 group">
      <span className="text-base" style={{ color: priority.color }}>
        {LEVEL_ICON[priority.level] ?? '·'}
      </span>
      <div className="flex-1">
        <p className="text-sm text-slate-700">{priority.name}</p>
        <p className="text-[10px] text-slate-400">
          Nível {priority.level}{priority.sla_days ? ` · SLA ${priority.sla_days}d` : ''}
        </p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="size-7 p-0" onClick={onEdit}><Pencil className="size-3" /></Button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={priority.id} />
          <Button type="submit" size="sm" variant="ghost" className="size-7 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="size-3" />
          </Button>
        </form>
      </div>
    </li>
  )
}
