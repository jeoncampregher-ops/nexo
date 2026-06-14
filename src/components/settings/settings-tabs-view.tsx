'use client'

import { useState } from 'react'
import { Building2, Users, Flag, Layers, TrendingUp, UserCircle, ShieldCheck } from 'lucide-react'
import { SectorsSettings } from './sectors-settings'
import { TeamsSettings } from './teams-settings'
import { PrioritiesSettings } from './priorities-settings'
import { StatusesSettings } from './statuses-settings'
import { RoiConfigSettings } from './roi-config-settings'
import { UsersSettings } from './users-settings'
import { PermissionsSettings } from './permissions-settings'
import { cn } from '@/lib/utils'
import type { Sector, Team, Status, Priority, RoiConfig, Profile } from '@/lib/types'

interface Props {
  sectors: Sector[]
  teams: Team[]
  statuses: Status[]
  priorities: Priority[]
  roiConfig: RoiConfig | null
  profiles: Profile[]
  currentUserId: string
}

const TABS = [
  { id: 'setores',      label: 'Setores',      icon: Building2,   desc: 'Áreas e departamentos solicitantes' },
  { id: 'times',        label: 'Times',        icon: Users,        desc: 'Times de desenvolvimento' },
  { id: 'prioridades',  label: 'Prioridades',  icon: Flag,         desc: 'Níveis de prioridade e SLA' },
  { id: 'status',       label: 'Status',       icon: Layers,       desc: 'Status de pedidos e projetos' },
  { id: 'roi',          label: 'ROI',          icon: TrendingUp,   desc: 'Custo/hora e multiplicadores' },
  { id: 'usuarios',     label: 'Usuários',     icon: UserCircle,   desc: 'Papéis e acesso dos usuários' },
  { id: 'permissoes',   label: 'Permissões',   icon: ShieldCheck,  desc: 'Matriz de acesso por perfil' },
] as const

type TabId = typeof TABS[number]['id']

export function SettingsTabsView({ sectors, teams, statuses, priorities, roiConfig, profiles, currentUserId }: Props) {
  const [active, setActive] = useState<TabId>('setores')

  const currentTab = TABS.find((t) => t.id === active)!

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab navigation */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 px-6 shrink-0">
        <nav className="flex gap-0 -mb-px overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3.5 border-b-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all',
                  isActive
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700'
                )}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60 dark:bg-transparent">
        <div className={cn('mx-auto flex flex-col gap-4', active === 'permissoes' ? 'max-w-3xl' : 'max-w-2xl')}>
          {/* Section header */}
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-100 dark:ring-indigo-500/20 flex items-center justify-center">
              <currentTab.icon className="size-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{currentTab.label}</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{currentTab.desc}</p>
            </div>
          </div>

          {/* Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="p-6">
              {active === 'setores'     && <SectorsSettings sectors={sectors} />}
              {active === 'times'       && <TeamsSettings teams={teams} />}
              {active === 'prioridades' && <PrioritiesSettings priorities={priorities} />}
              {active === 'status'      && <StatusesSettings statuses={statuses} />}
              {active === 'roi'         && <RoiConfigSettings roiConfig={roiConfig} />}
              {active === 'usuarios'    && <UsersSettings profiles={profiles} currentUserId={currentUserId} />}
              {active === 'permissoes'  && <PermissionsSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
