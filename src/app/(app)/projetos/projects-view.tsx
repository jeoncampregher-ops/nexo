'use client'

import { useState, useTransition, useMemo } from 'react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectListRow } from '@/components/projects/project-list-row'
import { NewProjectModal } from '@/components/projects/new-project-modal'
import { updateProjectKanban } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Kanban, List, Plus, Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, Status, Sector, Team, Priority, Profile } from '@/lib/types'

interface Props {
  projects: Project[]
  statuses: Status[]
  sectors: Sector[]
  teams: Team[]
  priorities: Priority[]
  profiles: Profile[]
  defaultStatusId: string
}

type SortKey = 'title' | 'sector' | 'status' | 'priority' | 'start_date' | 'expected_date'

const PAGE_SIZE = 15

const COLS: { key: SortKey | null; label: string }[] = [
  { key: 'title', label: 'Projeto' },
  { key: 'sector', label: 'Setor' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Prioridade' },
  { key: 'start_date', label: 'Início' },
  { key: 'expected_date', label: 'Entrega' },
  { key: null, label: 'Responsável' },
]

export function ProjectsView({ projects, statuses, sectors, teams, priorities, profiles, defaultStatusId }: Props) {
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let r = [...projects]
    if (search) r = r.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    if (statusFilter) r = r.filter((p) => p.status_id === statusFilter)
    if (sectorFilter) r = r.filter((p) => p.sector_id === sectorFilter)
    if (priorityFilter) r = r.filter((p) => p.priority_id === priorityFilter)

    r.sort((a, b) => {
      let va: string | number = '', vb: string | number = ''
      if (sortBy === 'title') { va = a.title; vb = b.title }
      else if (sortBy === 'sector') { va = a.sector?.name ?? ''; vb = b.sector?.name ?? '' }
      else if (sortBy === 'status') { va = a.status?.position ?? 999; vb = b.status?.position ?? 999 }
      else if (sortBy === 'priority') { va = a.priority?.level ?? 0; vb = b.priority?.level ?? 0 }
      else if (sortBy === 'start_date') { va = a.start_date ?? ''; vb = b.start_date ?? '' }
      else if (sortBy === 'expected_date') { va = a.expected_date ?? ''; vb = b.expected_date ?? '' }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
    return r
  }, [projects, search, statusFilter, sectorFilter, priorityFilter, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleReorder = async (updates: { id: string; status_id: string | null; kanban_position: number }[]) => {
    startTransition(async () => { await updateProjectKanban(updates) })
  }

  const resetFilters = () => {
    setSearch(''); setStatusFilter(''); setSectorFilter(''); setPriorityFilter(''); setPage(1)
  }

  const hasFilters = search || statusFilter || sectorFilter || priorityFilter

  return (
    <>
      <NewProjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultStatusId={defaultStatusId}
        sectors={sectors}
        teams={teams}
        priorities={priorities}
        profiles={profiles}
      />

      <div className="flex flex-col gap-4 flex-1 min-h-0">
        {/* Aviso: sem status configurado */}
        {!defaultStatusId && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-800">
              Nenhum <strong>status de projeto</strong> configurado. Acesse{' '}
              <a href="/configuracoes" className="font-semibold underline underline-offset-2 hover:text-amber-900">Configurações → Status</a>{' '}
              e crie ao menos um status do tipo <em>projeto</em> para poder criar projetos.
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setView('list')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all', view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')}
            >
              <List className="size-3.5" /> Lista
            </button>
            <button
              onClick={() => setView('kanban')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all', view === 'kanban' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200')}
            >
              <Kanban className="size-3.5" /> Kanban
            </button>
          </div>

          <div className="flex-1" />

          {/* Filters */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar projeto…"
              className="h-8 pl-8 pr-3 text-xs w-44"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? ''); setPage(1) }}>
            <SelectTrigger className="h-8 text-xs w-36">
              <span className={statusFilter ? 'text-slate-900' : 'text-slate-400'}>
                {statusFilter ? (statuses.find((s) => s.id === statusFilter)?.name ?? 'Status') : 'Status'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os status</SelectItem>
              {statuses.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={sectorFilter} onValueChange={(v) => { setSectorFilter(v ?? ''); setPage(1) }}>
            <SelectTrigger className="h-8 text-xs w-36">
              <span className={sectorFilter ? 'text-slate-900' : 'text-slate-400'}>
                {sectorFilter ? (sectors.find((s) => s.id === sectorFilter)?.name ?? 'Setor') : 'Setor'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os setores</SelectItem>
              {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v ?? ''); setPage(1) }}>
            <SelectTrigger className="h-8 text-xs w-36">
              <span className={priorityFilter ? 'text-slate-900' : 'text-slate-400'}>
                {priorityFilter ? (priorities.find((p) => p.id === priorityFilter)?.name ?? 'Prioridade') : 'Prioridade'}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {priorities.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasFilters && (
            <button onClick={resetFilters} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 transition-colors">
              Limpar
            </button>
          )}

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            disabled={!defaultStatusId}
            title={!defaultStatusId ? 'Configure um status de projeto primeiro' : undefined}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white h-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="size-3.5" /> Novo projeto
          </Button>
        </div>

        {/* List view */}
        {view === 'list' && (
          <div className="flex flex-col gap-0 flex-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/6 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/8 bg-slate-50/60 dark:bg-white/4">
                    {COLS.map(({ key, label }) => (
                      <th
                        key={label}
                        className={cn('px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap', key && 'cursor-pointer select-none hover:text-slate-700')}
                        onClick={() => key && handleSort(key)}
                      >
                        <span className="flex items-center gap-0.5">
                          {label}
                          {key && <SortIcon col={key} sortBy={sortBy} sortDir={sortDir} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                        {hasFilters ? 'Nenhum projeto encontrado com os filtros aplicados.' : 'Nenhum projeto ainda. Crie o primeiro!'}
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p) => <ProjectListRow key={p.id} project={p} />)
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} de{' '}
                  <strong className="text-slate-600">{filtered.length}</strong> projeto{filtered.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="size-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="size-3.5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                    .reduce<(number | '...')[]>((acc, n, i, arr) => {
                      if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...')
                      acc.push(n)
                      return acc
                    }, [])
                    .map((n, i) =>
                      n === '...' ? (
                        <span key={`e${i}`} className="px-1 text-xs text-slate-400 dark:text-slate-500">…</span>
                      ) : (
                        <button
                          key={n}
                          onClick={() => setPage(n as number)}
                          className={cn('size-7 text-xs rounded-lg border transition-colors', page === n ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold' : 'border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5')}
                        >
                          {n}
                        </button>
                      )
                    )}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="size-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kanban view */}
        {view === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <KanbanBoard
              statuses={statuses}
              items={projects}
              onReorder={handleReorder}
              renderCard={(project, isDragging) => (
                <ProjectCard key={project.id} project={project as Project} isDragging={isDragging} />
              )}
            />
          </div>
        )}
      </div>
    </>
  )
}

function SortIcon({ col, sortBy, sortDir }: { col: SortKey; sortBy: SortKey; sortDir: 'asc' | 'desc' }) {
  if (sortBy !== col) return <ChevronsUpDown className="size-3 text-slate-300 ml-0.5" />
  return sortDir === 'asc'
    ? <ChevronUp className="size-3 text-indigo-500 ml-0.5" />
    : <ChevronDown className="size-3 text-indigo-500 ml-0.5" />
}
