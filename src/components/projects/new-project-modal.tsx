'use client'

import { useActionState, useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/actions/projects'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Loader2, Plus, X, FolderKanban, AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Sector, Team, Priority, Profile } from '@/lib/types'

interface Props {
  defaultStatusId: string
  sectors: Sector[]
  teams: Team[]
  priorities: Priority[]
  profiles: Profile[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const lbl = 'block text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5'
const inp = 'h-10 w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] text-slate-800 placeholder:text-slate-300 focus-visible:border-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-100 transition-all'
const sel = 'w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] gap-2 data-placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-indigo-400 focus-visible:ring-indigo-100 transition-all'
const txt = 'w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] text-slate-800 placeholder:text-slate-300 focus-visible:border-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-100 resize-none transition-all'

function DateField({ name, label, onDirty }: { name: string; label: string; onDirty?: () => void }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      <DatePicker name={name} placeholder="dd/mm/aaaa" onSelect={onDirty} />
    </div>
  )
}

export function NewProjectModal({
  defaultStatusId, sectors, teams, priorities, profiles, open, onOpenChange,
}: Props) {
  const [state, action, pending] = useActionState(createProject, null)
  const [isDirty, setIsDirty] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const markDirty = useCallback(() => setIsDirty(true), [])

  const doClose = useCallback(() => {
    setIsDirty(false)
    setConfirmOpen(false)
    formRef.current?.reset()
    onOpenChange(false)
  }, [onOpenChange])

  const requestClose = useCallback(() => {
    if (isDirty) setConfirmOpen(true)
    else doClose()
  }, [isDirty, doClose])

  useEffect(() => {
    if (state?.success) {
      setIsDirty(false)
      onOpenChange(false)
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, onOpenChange, router])

  // Reset dirty/confirm state when modal opens fresh
  useEffect(() => {
    if (open) { setIsDirty(false); setConfirmOpen(false) }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) requestClose() }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
      >
        {/* Overlay de confirmação de descarte */}
        {confirmOpen && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-[6px]">
            <div className="flex flex-col items-center gap-4 px-8 py-6 text-center max-w-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="size-12 rounded-2xl bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center">
                <AlertTriangle className="size-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Descartar alterações?</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você preencheu alguns campos.<br />Fechar agora vai perder tudo.
                </p>
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => setConfirmOpen(false)}
                >
                  Continuar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white border-red-500"
                  onClick={doClose}
                >
                  Descartar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cabeçalho escuro */}
        <div className="relative flex items-center gap-3.5 px-6 py-4 bg-slate-950">
          <div className="size-9 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/30 flex items-center justify-center shrink-0">
            <FolderKanban className="size-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-semibold text-white leading-none mb-0.5">
              Novo projeto
            </DialogTitle>
            <p className="text-[11px] text-slate-400">Preencha as informações abaixo para criar um projeto</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="size-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <form ref={formRef} action={action} onChange={markDirty}>
          <input type="hidden" name="status_id" value={defaultStatusId} />

          <Tabs defaultValue="geral">
            {/* Barra de tabs */}
            <div className="flex items-center border-b border-slate-100 bg-slate-50 px-6">
              <TabsList
                variant="line"
                className="h-auto rounded-none bg-transparent p-0 w-full justify-start gap-0"
              >
                <TabsTrigger
                  value="geral"
                  className={cn(
                    'relative rounded-none bg-transparent px-4 py-3 text-[11px] font-bold uppercase tracking-widest',
                    'text-slate-400 hover:text-slate-600 transition-colors',
                    'data-active:text-indigo-600',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:opacity-0 data-active:after:opacity-100',
                  )}
                >
                  Geral
                </TabsTrigger>
                <TabsTrigger
                  value="analise"
                  className={cn(
                    'relative rounded-none bg-transparent px-4 py-3 text-[11px] font-bold uppercase tracking-widest',
                    'text-slate-400 hover:text-slate-600 transition-colors',
                    'data-active:text-indigo-600',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500 after:opacity-0 data-active:after:opacity-100',
                  )}
                >
                  Análise
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Aba Geral */}
            <TabsContent value="geral" className="p-0 mt-0">
              <div className="px-6 py-5 flex flex-col gap-4 max-h-[58vh] overflow-y-auto">

                {/* Título */}
                <div>
                  <label className={lbl}>
                    Título <span className="text-indigo-500 normal-case tracking-normal font-semibold">*</span>
                  </label>
                  <Input
                    name="title"
                    required
                    placeholder="Ex: Sistema de aprovação de pedidos"
                    className={inp}
                  />
                </div>

                {/* Descritivo */}
                <div>
                  <label className={lbl}>Descritivo</label>
                  <Textarea
                    name="description"
                    placeholder="Contexto geral do projeto, objetivo e impacto esperado..."
                    rows={2}
                    className={txt}
                  />
                </div>

                {/* Divider */}
                <div className="-mx-6 h-px bg-slate-100" />

                {/* Setor + Responsável */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Setor solicitante</label>
                    <Select name="sector_id">
                      <SelectTrigger size="lg" className={sel}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={lbl}>Responsável</label>
                    <Select name="assignee_id">
                      <SelectTrigger size="lg" className={sel}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Datas */}
                <div className="grid grid-cols-3 gap-3">
                  <DateField name="start_date" label="Início dev." onDirty={markDirty} />
                  <DateField name="expected_date" label="Fim dev." onDirty={markDirty} />
                  <DateField name="homologation_date" label="Homologação" onDirty={markDirty} />
                </div>

                {/* Prioridade + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Prioridade</label>
                    <Select name="priority_id">
                      <SelectTrigger size="lg" className={sel}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={lbl}>Time</label>
                    <Select name="team_id">
                      <SelectTrigger size="lg" className={sel}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Análise */}
            <TabsContent value="analise" className="p-0 mt-0">
              <div className="px-6 py-5 flex flex-col gap-4 max-h-[58vh] overflow-y-auto">

                <div>
                  <label className={lbl}>Análise do problema</label>
                  <Textarea
                    name="problem_analysis"
                    placeholder="Qual é o problema central que este projeto resolve? Quem é impactado?"
                    rows={3}
                    className={txt}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Ganho direto</label>
                    <Textarea
                      name="direct_gain"
                      placeholder="Redução de custo, tempo, retrabalho..."
                      rows={4}
                      className={txt}
                    />
                  </div>
                  <div>
                    <label className={lbl}>Ganho indireto</label>
                    <Textarea
                      name="indirect_gain"
                      placeholder="Satisfação, imagem, capacidade..."
                      rows={4}
                      className={txt}
                    />
                  </div>
                </div>

                <div>
                  <label className={lbl}>Análise técnica</label>
                  <Textarea
                    name="technical_analysis"
                    placeholder="Dependências, integrações, riscos técnicos e arquitetura de solução..."
                    rows={3}
                    className={txt}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Erro */}
          {state?.error && (
            <div className="mx-6 mb-0 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              {state.error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/80">
            <p className="text-[11px] text-slate-400">
              <span className="text-indigo-500 font-semibold">*</span> obrigatório
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={requestClose}
                className="text-slate-500 hover:text-slate-700 h-8"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={pending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-8 px-4 rounded-lg shadow-sm shadow-indigo-500/30"
              >
                {pending
                  ? <Loader2 className="size-3.5 animate-spin" />
                  : <Plus className="size-3.5" />}
                {pending ? 'Criando...' : 'Criar projeto'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
