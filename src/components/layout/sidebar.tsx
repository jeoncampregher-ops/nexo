'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NexoWordmark } from '@/components/brand/logo'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Kanban,
  ClipboardList,
  CheckSquare,
  GanttChart,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/projetos',   label: 'Projetos',   icon: Kanban },
  { href: '/pedidos',    label: 'Pedidos',    icon: ClipboardList },
  { href: '/finalizados',label: 'Finalizados',icon: CheckSquare },
  { href: '/gantt',      label: 'Gantt',      icon: GanttChart },
  { href: '/roi',        label: 'ROI',        icon: TrendingUp },
]

const BOTTOM_NAV = [
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-950 border-r border-white/5">
      {/* Logo */}
      <div className="flex flex-col justify-center px-5 h-[68px] border-b border-white/5 flex-shrink-0">
        <NexoWordmark className="text-2xl" />
        <p className="text-xs text-slate-500 mt-1">Gestão de projetos</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2.5">Menu</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              <Icon className={cn('size-[18px] flex-shrink-0 transition-colors', active ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-300')} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-white/5 flex flex-col gap-0.5">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              )}
            >
              <Icon className={cn('size-[18px] flex-shrink-0 transition-colors', active ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-300')} />
              {label}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 w-full text-left mt-1"
        >
          <LogOut className="size-[18px] flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors" />
          Sair
        </button>
      </div>
    </aside>
  )
}
