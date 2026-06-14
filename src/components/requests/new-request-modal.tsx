'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRequest } from '@/lib/actions/requests'
import { calcMonthlySavings } from '@/lib/roi'
import { formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { TrendingUp, AlertCircle, AlertTriangle, BarChart3, Banknote, Clock, Loader2, Percent, Plus, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Priority, RoiConfig, Sector } from '@/lib/types'

interface Props {
  defaultStatusId: string
  priorities: Priority[]
  sectors: Sector[]
  roiConfig: RoiConfig | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const lbl = 'block text-[10.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5'
const inp = 'h-10 w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] text-slate-800 placeholder:text-slate-300 focus-visible:border-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-100 transition-all'
const sel = 'w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] data-placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-indigo-400 focus-visible:ring-indigo-100 transition-all'
const txt = 'w-full rounded-xl border-slate-200 bg-white shadow-sm text-[13px] text-slate-800 placeholder:text-slate-300 focus-visible:border-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-100 resize-none transition-all'

const BENEFIT_TYPES = [
  { value: 'cost_reduction',   label: 'Redução de custo operacional' },
  { value: 'revenue_increase', label: 'Aumento de receita' },
  { value: 'compliance',       label: 'Conformidade / Regulatório' },
  { value: 'quality',          label: 'Melhoria de qualidade / Risco' },
]

function RoiField({ icon: Icon, label, hint, children }: {
  icon: React.ElementType; label: string; hint: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="size-3 text-indigo-400" />
        <label className={cn(lbl, 'mb-0')}>{label}</label>
      </div>
      {children}
      <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">{hint}</p>
    </div>
  )
}

export function NewRequestModal({ defaultStatusId, priorities, sectors, roiConfig, open, onOpenChange }: Props) {
  const [state, action, pending] = useActionState(createRequest, null)
  const [isDirty, setIsDirty] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [processCost, setProcessCost] = useState('')
  const [reductionPct, setReductionPct] = useState('')
  const [people, setPeople] = useState('')
  const [hoursSaved, setHoursSaved] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const markDirty = useCallback(() => setIsDirty(true), [])

  const doClose = useCallback(() => {
    setIsDirty(false)
    setConfirmOpen(false)
    setProcessCost('')
    setReductionPct('')
    setPeople('')
    setHoursSaved('')
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

  useEffect(() => {
    if (open) { setIsDirty(false); setConfirmOpen(false) }
  }, [open])

  const monthlySavings = roiConfig && (processCost || people || hoursSaved)
    ? calcMonthlySavings({
        currentProcessCost: parseFloat(processCost) || 0,
        costReductionPct: parseFloat(reductionPct) || 0,
        peopleImpacted: parseInt(people) || 0,
        hoursSavedPerPerson: parseFloat(hoursSaved) || 0,
        hourlyRate: roiConfig.hourly_rate,
      })
    : null
  const annualSavings = monthlySavings != null ? monthlySavings * 12 : null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) requestClose() }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10"
      >
        {/* Discard overlay */}
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
                <Button type="button" variant="outline" size="sm" className="flex-1 h-8" onClick={() => setConfirmOpen(false)}>
                  Continuar
                </Button>
                <Button type="button" size="sm" className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white border-red-500" onClick={doClose}>
                  Descartar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dark header */}
        <div className="relative flex items-center gap-3.5 px-6 py-4 bg-slate-950">
          <div className="size-9 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/30 flex items-center justify-center shrink-0">
            <BarChart3 className="size-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-sm font-semibold text-white leading-none mb-0.5">
              Novo pedido
            </DialogTitle>
            <p className="text-[11px] text-slate-400">Descreva sua demanda e estime o valor do projeto</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="size-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <form ref={formRef} action={action} onChange={markDirty} className="flex flex-col">
          <input type="hidden" name="status_id" value={defaultStatusId} />

          <div className="px-6 py-5 flex flex-col gap-4 max-h-[62vh] overflow-y-auto">
            {/* Título */}
            <div>
              <label className={lbl}>Título <span className="text-indigo-500 normal-case tracking-normal font-semibold">*</span></label>
              <Input name="title" required placeholder="Ex: Portal de aprovação de contratos" className={inp} />
            </div>

            {/* Descrição */}
            <div>
              <label className={lbl}>Descrição</label>
              <Textarea name="description" placeholder="Contexto do pedido, dores atuais e objetivo esperado…" rows={2} className={txt} />
            </div>

            {/* Setor + Prioridade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Setor</label>
                <Select name="sector_id">
                  <SelectTrigger size="lg" className={sel}><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={lbl}>Prioridade</label>
                <Select name="priority_id">
                  <SelectTrigger size="lg" className={sel}><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data desejada */}
            <div className="max-w-[50%] pr-1.5">
              <label className={lbl}>Data desejada</label>
              <DatePicker name="expected_date" placeholder="dd/mm/aaaa" onSelect={markDirty} />
            </div>

            {/* Divisor Análise de Valor */}
            <div className="flex items-center gap-3 -mx-6 px-6">
              <div className="flex-1 h-px bg-slate-100" />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 ring-1 ring-indigo-100">
                <BarChart3 className="size-3 text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Análise de valor</span>
              </div>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <p className="text-[12px] text-slate-400 leading-relaxed -mt-1">
              Essas informações permitem calcular o ROI do projeto automaticamente. Preencha o que souber.
            </p>

            {/* Tipo de benefício */}
            <div>
              <label className={lbl}>Tipo de benefício</label>
              <Select name="benefit_type">
                <SelectTrigger size="lg" className={sel}><SelectValue placeholder="Selecione o tipo…" /></SelectTrigger>
                <SelectContent>
                  {BENEFIT_TYPES.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Custo + Redução */}
            <div className="grid grid-cols-2 gap-3">
              <RoiField icon={Banknote} label="Custo atual do processo (R$/mês)" hint="Quanto custa manter esse processo hoje, em reais por mês?">
                <Input name="current_process_cost" type="number" min="0" step="100" placeholder="Ex: 8000" className={inp}
                  value={processCost} onChange={(e) => { setProcessCost(e.target.value); markDirty() }} />
              </RoiField>
              <RoiField icon={Percent} label="Redução esperada (%)" hint="Qual % desse custo será eliminado com a solução?">
                <Input name="cost_reduction_pct" type="number" min="0" max="100" step="5" placeholder="Ex: 70" className={inp}
                  value={reductionPct} onChange={(e) => { setReductionPct(e.target.value); markDirty() }} />
              </RoiField>
            </div>

            {/* Pessoas + Horas */}
            <div className="grid grid-cols-2 gap-3">
              <RoiField icon={Users} label="Pessoas impactadas" hint="Quantas pessoas participam desse processo hoje?">
                <Input name="people_impacted" type="number" min="0" step="1" placeholder="Ex: 5" className={inp}
                  value={people} onChange={(e) => { setPeople(e.target.value); markDirty() }} />
              </RoiField>
              <RoiField icon={Clock} label="Horas economizadas / pessoa / mês" hint="Quantas horas por mês cada pessoa deixará de gastar?">
                <Input name="hours_saved_per_person" type="number" min="0" step="0.5" placeholder="Ex: 12" className={inp}
                  value={hoursSaved} onChange={(e) => { setHoursSaved(e.target.value); markDirty() }} />
              </RoiField>
            </div>

            {/* Preview ROI */}
            {monthlySavings != null && monthlySavings > 0 && (
              <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 px-4 py-3.5 flex items-start gap-3">
                <TrendingUp className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-2">Economia projetada</p>
                  <div className="flex gap-5">
                    <div>
                      <p className="text-[10px] text-emerald-600/70 mb-0.5">Por mês</p>
                      <p className="text-base font-bold text-emerald-700">{formatCurrency(monthlySavings)}</p>
                    </div>
                    <div className="w-px bg-emerald-200" />
                    <div>
                      <p className="text-[10px] text-emerald-600/70 mb-0.5">Por ano</p>
                      <p className="text-base font-bold text-emerald-700">{formatCurrency(annualSavings!)}</p>
                    </div>
                    {roiConfig && (
                      <>
                        <div className="w-px bg-emerald-200" />
                        <div>
                          <p className="text-[10px] text-emerald-600/70 mb-0.5">Custo/hora usado</p>
                          <p className="text-base font-bold text-emerald-700">{formatCurrency(roiConfig.hourly_rate)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Erro */}
          {state?.error && (
            <div className="mx-6 mb-2 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
              {state.error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 shrink-0">
            <p className="text-[11px] text-slate-400">
              <span className="text-indigo-500 font-semibold">*</span> obrigatório
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={requestClose} className="text-slate-500 hover:text-slate-700 h-8">
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={pending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-8 px-4 rounded-lg shadow-sm shadow-indigo-500/30"
              >
                {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
                {pending ? 'Enviando…' : 'Enviar pedido'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
