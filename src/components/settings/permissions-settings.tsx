'use client'

import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

const ROLES: { id: Role; label: string; desc: string; ring: string; darkRing: string; text: string; darkText: string; dot: string }[] = [
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Acesso total ao sistema',
    ring: 'ring-rose-200',
    darkRing: 'dark:ring-rose-500/30',
    text: 'text-rose-700',
    darkText: 'dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  {
    id: 'gestor',
    label: 'Gestor',
    desc: 'Gerencia projetos e pedidos',
    ring: 'ring-indigo-200',
    darkRing: 'dark:ring-indigo-500/30',
    text: 'text-indigo-700',
    darkText: 'dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  {
    id: 'dev',
    label: 'Dev',
    desc: 'Executa e atualiza projetos',
    ring: 'ring-emerald-200',
    darkRing: 'dark:ring-emerald-500/30',
    text: 'text-emerald-700',
    darkText: 'dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    id: 'solicitante',
    label: 'Solicitante',
    desc: 'Abre e acompanha pedidos',
    ring: 'ring-slate-200',
    darkRing: 'dark:ring-white/10',
    text: 'text-slate-600',
    darkText: 'dark:text-slate-400',
    dot: 'bg-slate-400',
  },
]

type PermRow = { label: string; perms: Record<Role, boolean> }
type Group = { title: string; rows: PermRow[] }

const GROUPS: Group[] = [
  {
    title: 'Dashboard',
    rows: [
      { label: 'Ver métricas e gráficos', perms: { admin: true, gestor: true, dev: true, solicitante: true } },
      { label: 'Ver ROI calculado',        perms: { admin: true, gestor: true, dev: true, solicitante: false } },
    ],
  },
  {
    title: 'Pedidos',
    rows: [
      { label: 'Ver todos os pedidos',           perms: { admin: true,  gestor: true,  dev: true,  solicitante: true  } },
      { label: 'Criar pedidos',                  perms: { admin: true,  gestor: true,  dev: true,  solicitante: true  } },
      { label: 'Aprovar / Rejeitar pedidos',     perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
      { label: 'Editar pedidos de outros',       perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
      { label: 'Deletar pedidos',                perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
    ],
  },
  {
    title: 'Projetos',
    rows: [
      { label: 'Ver todos os projetos',          perms: { admin: true,  gestor: true,  dev: true,  solicitante: true  } },
      { label: 'Criar projetos',                 perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
      { label: 'Editar projetos',                perms: { admin: true,  gestor: true,  dev: true,  solicitante: false } },
      { label: 'Mover no Kanban',                perms: { admin: true,  gestor: true,  dev: true,  solicitante: false } },
      { label: 'Deletar projetos',               perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
      { label: 'Ver Gantt',                      perms: { admin: true,  gestor: true,  dev: true,  solicitante: true  } },
    ],
  },
  {
    title: 'Configurações',
    rows: [
      { label: 'Setores, times, status, prioridades e ROI', perms: { admin: true,  gestor: true,  dev: false, solicitante: false } },
      { label: 'Gerenciar usuários',                        perms: { admin: true,  gestor: false, dev: false, solicitante: false } },
      { label: 'Alterar permissões',                        perms: { admin: true,  gestor: false, dev: false, solicitante: false } },
    ],
  },
]

export function PermissionsSettings() {
  return (
    <div className="flex flex-col gap-5">
      {/* Role cards */}
      <div className="grid grid-cols-4 gap-3">
        {ROLES.map((r) => (
          <div
            key={r.id}
            className={cn('rounded-xl bg-white dark:bg-slate-800 p-3.5 ring-1 flex flex-col gap-1.5', r.ring, r.darkRing)}
          >
            <div className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full shrink-0', r.dot)} />
              <span className={cn('text-[11px] font-bold uppercase tracking-widest', r.text, r.darkText)}>
                {r.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="rounded-xl border border-slate-200 dark:border-white/6 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-white/4 border-b border-slate-200 dark:border-white/8">
              <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide w-[46%]">
                Recurso / Ação
              </th>
              {ROLES.map((r) => (
                <th
                  key={r.id}
                  className={cn('px-3 py-3 text-[11px] font-bold uppercase tracking-widest text-center', r.text, r.darkText)}
                >
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <>
                {/* Group header */}
                <tr key={`g-${group.title}`} className="bg-slate-50/40 dark:bg-white/2 border-t border-slate-100 dark:border-white/5">
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
                  >
                    {group.title}
                  </td>
                </tr>

                {/* Permission rows */}
                {group.rows.map((row, i) => (
                  <tr
                    key={`${group.title}-${i}`}
                    className="border-t border-slate-50 dark:border-white/4 hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-[12.5px] text-slate-700 dark:text-slate-300">{row.label}</td>
                    {ROLES.map((r) => (
                      <td key={r.id} className="px-3 py-2.5 text-center">
                        {row.perms[r.id] ? (
                          <span className="inline-flex items-center justify-center size-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200 dark:ring-emerald-500/20">
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center size-5 rounded-full bg-slate-100 dark:bg-white/5 ring-1 ring-slate-200 dark:ring-white/10">
                            <Minus className="size-3 text-slate-300 dark:text-slate-600 stroke-[2.5]" />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
        As permissões são aplicadas no banco de dados via Row Level Security (RLS) do Supabase.
        Para alterar o acesso de um usuário, mude seu perfil na aba{' '}
        <span className="font-semibold text-slate-500 dark:text-slate-400">Usuários</span>.
      </p>
    </div>
  )
}
