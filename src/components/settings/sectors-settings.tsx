'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { createSector, updateSector, deleteSector } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'
import type { Sector } from '@/lib/types'

interface Props { sectors: Sector[] }

export function SectorsSettings({ sectors }: Props) {
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [createState, createAction, createPending] = useActionState(createSector, null)

  useEffect(() => {
    if (createState?.success) setCreating(false)
  }, [createState])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Setores</h2>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setCreating(true)}>
          <Plus className="size-3.5" /> Novo setor
        </Button>
      </div>

      {creating && (
        <form action={createAction} className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-xs">Nome</Label>
            <Input name="name" placeholder="Ex: Financeiro" autoFocus required className="h-8 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Cor</Label>
            <input name="color" type="color" defaultValue="#6366f1" className="h-8 w-12 rounded border border-slate-200 cursor-pointer" />
          </div>
          <Button type="submit" size="sm" disabled={createPending}><Check className="size-3.5" /></Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}><X className="size-3.5" /></Button>
          {createState?.error && <p className="text-xs text-red-500 self-center">{createState.error}</p>}
        </form>
      )}

      <ul className="divide-y divide-slate-100">
        {sectors.map((s) => (
          <SectorRow
            key={s.id}
            sector={s}
            editing={editId === s.id}
            onEdit={() => setEditId(s.id)}
            onCancelEdit={() => setEditId(null)}
          />
        ))}
      </ul>
    </section>
  )
}

function SectorRow({ sector, editing, onEdit, onCancelEdit }: {
  sector: Sector; editing: boolean; onEdit: () => void; onCancelEdit: () => void
}) {
  const [updateState, updateAction, updatePending] = useActionState(updateSector, null)
  const [, deleteAction] = useActionState(deleteSector, null)

  useEffect(() => {
    if (updateState?.success) onCancelEdit()
  }, [updateState, onCancelEdit])

  if (editing) {
    return (
      <li className="py-2">
        <form action={updateAction} className="flex items-end gap-2">
          <input type="hidden" name="id" value={sector.id} />
          <div className="flex flex-col gap-1 flex-1">
            <Input name="name" defaultValue={sector.name} required className="h-8 text-sm" autoFocus />
          </div>
          <input name="color" type="color" defaultValue={sector.color} className="h-8 w-12 rounded border border-slate-200 cursor-pointer" />
          <Button type="submit" size="sm" disabled={updatePending}><Check className="size-3.5" /></Button>
          <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}><X className="size-3.5" /></Button>
        </form>
        {updateState?.error && <p className="text-xs text-red-500 mt-1">{updateState.error}</p>}
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 py-2.5 group">
      <span className="size-3 rounded-full flex-shrink-0" style={{ backgroundColor: sector.color }} />
      <span className="text-sm text-slate-700 flex-1">{sector.name}</span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost" className="size-7 p-0" onClick={onEdit}><Pencil className="size-3" /></Button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={sector.id} />
          <Button type="submit" size="sm" variant="ghost" className="size-7 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="size-3" />
          </Button>
        </form>
      </div>
    </li>
  )
}
