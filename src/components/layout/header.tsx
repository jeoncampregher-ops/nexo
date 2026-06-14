import { logout } from '@/lib/actions/auth'
import { getCurrentProfile } from '@/lib/queries/settings'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LogOut } from 'lucide-react'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  gestor: 'Gestor',
  dev: 'Desenvolvedor',
  solicitante: 'Solicitante',
}

interface Props {
  title: string
  actions?: React.ReactNode
}

export async function Header({ title, actions }: Props) {
  const profile = await getCurrentProfile()

  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">
        {actions}

        <ThemeToggle />

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/8">
          <div className="hidden sm:flex items-center gap-2.5 cursor-default">
            <UserAvatar user={profile} size="sm" />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {ROLE_LABEL[profile?.role ?? ''] ?? profile?.role}
              </p>
            </div>
          </div>

          <form action={logout}>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
              title="Sair"
            >
              <LogOut className="size-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
