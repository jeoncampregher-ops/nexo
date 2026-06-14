'use client'

import { useActionState } from 'react'
import { updateUserRole, toggleUserActive } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserAvatar } from '@/components/shared/user-avatar'
import type { Profile, Role } from '@/lib/types'

interface Props { profiles: Profile[]; currentUserId: string }

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'dev', label: 'Dev' },
  { value: 'solicitante', label: 'Solicitante' },
]

export function UsersSettings({ profiles, currentUserId }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Usuários</h2>
      <ul className="divide-y divide-slate-100 dark:divide-white/5">
        {profiles.map((p) => (
          <UserRow key={p.id} profile={p} isSelf={p.id === currentUserId} />
        ))}
      </ul>
    </section>
  )
}

function UserRow({ profile, isSelf }: { profile: Profile; isSelf: boolean }) {
  const [, roleAction] = useActionState(updateUserRole, null)
  const [, toggleAction] = useActionState(toggleUserActive, null)

  return (
    <li className="flex items-center gap-3 py-3">
      <UserAvatar user={profile} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
          {profile.full_name}
          {isSelf && <span className="ml-1.5 text-[10px] text-slate-400">(você)</span>}
        </p>
        <p className="text-xs text-slate-400 truncate">{profile.email}</p>
      </div>

      <form action={roleAction} className="flex items-center gap-2">
        <input type="hidden" name="user_id" value={profile.id} />
        <Select name="role" defaultValue={profile.role} disabled={isSelf}>
          <SelectTrigger className="h-7 text-xs w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {!isSelf && (
          <Button type="submit" size="sm" variant="outline" className="h-7 text-xs px-2">
            Salvar
          </Button>
        )}
      </form>

      {!isSelf && (
        <form action={toggleAction}>
          <input type="hidden" name="user_id" value={profile.id} />
          <input type="hidden" name="active" value={profile.active ? 'false' : 'true'} />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className={`h-7 text-xs px-2 ${profile.active ? 'text-slate-500' : 'text-emerald-600'}`}
          >
            {profile.active ? 'Desativar' : 'Ativar'}
          </Button>
        </form>
      )}
    </li>
  )
}
