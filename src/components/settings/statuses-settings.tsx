'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { createStatus, updateStatus, deleteStatus } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'
import type { Status } from '@/lib/types'

interface Props { statuses: Status[] }

const APPLIES_OPTIONS = [
  { value: 'request', label: 'Pedidos' },
  { value: 'project', label: 'Projetos' },
  { value: 'both', label: 'Ambos' },
]

export function StatusesSettings({ statuses }: Props) {
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [createState, createAction, createPending] = useActionState(createStatus, null)

  useEffect(() => {
    if (createState?.success) setCreating(false)
  }, [createState])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Status</h2>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="size-3.5" /> Novo status
        </Button>
      </div>

      {creating && (
        <form action={createAction} className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Nome *</Label>
              <Input name="name" placeholder="Ex: Em Review" autoFocus required className="h-8 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Cor</Label>
              <input name="color" type="color" defaultValue="#6366f1" className="h-8 w-full rounded border border-slate-200 cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Aplica-se a</Label>
              <Select name="applies_to" defaultValue="both">
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{APPLIES_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Posição</Label>
              <Input name="position" type="number" defaultValue={statuses.length} className="h-8 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" name="is_final" value="true" className="size-4 rounded" />
            Status final (conclui o item)
          </label>
          <div className="flex justify-end gap-2">
            {createState?.error && <p className="text-xs text-red-500 self-center flex-1">{createState.error}</p>}
            <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}><X className="size-3.5" /></Button>
            <Button type="submit" size="sm" disabled={createPending}><Check className="size-3.5" /> Salvar</Button>
          </div>
        </form>
      )}

      <ul className="divide-y divide-slate-100">
        {statuses.map((s) => (
          <StatusRow
            key={s.id}
            status={s}
            editing={editId === s.id}
            onEdit={() => setEditId(s.id)}
            onCancelEdit={() => setEditId(null)}
          />
        ))}
      </ul>
    </section>
  )
}

function StatusRow({ status, editing, onEdit, onCancelEdit }: {
  status: Status; editing: boolean; onEdit: () => void; onCancelEdit: () => void
}) {
  const [updateState, updateAction, updatePending] = useActionState(updateStatus, null)
  const [, deleteAction] = useActionState(deleteStatus, null)

  useEffect(() => {
    if (updateState?.success) onCancelEdit()
  }, [updateState, onCancelEdit])

  const appliesLabel = APPLIES_OPTIONS.find((o) => o.value === status.applies_to)?.label ?? status.applies_to

  if (editing) {
    return (
      <li className="py-2">
        <form action={updateAction} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={status.id} />
          <div className="grid grid-cols-2 gap-2">
            <Input name="name" defaultValue={status.name} required className="h-8 text-sm" autoFocus />
            <input name="color" type="color" defaultValue={status.color} className="h-8 w-full rounded border border-slate-200 cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select name="applies_to" defaultValue={status.applies_to}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{APPLIES_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input name="position" type="number" defaultValue={status.position} className="h-8 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" name="is_final" value="true" defaultChecked={status.is_final} className="size-4 rounded" />
            Status final
          </label>
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
      <span className="size-3 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
      <div className="flex-1">
        <p className="text-sm text-slate-700">{status.name}</p>
        <p className="text-[10px] text-slate-400">{appliesLabel} · pos {status.position}{status.is_final ? ' · final' : ''}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="size-7 p-0" onClick={onEdit}><Pencil className="size-3" /></Button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={status.id} />
          <Button type="submit" size="sm" variant="ghost" className="size-7 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="size-3" />
          </Button>
        </form>
      </div>
    </li>
  )
}
