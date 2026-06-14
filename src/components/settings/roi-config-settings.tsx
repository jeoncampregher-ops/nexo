'use client'

import { useActionState } from 'react'
import { updateRoiConfig } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { calcProjectRoi } from '@/lib/roi'
import type { RoiConfig } from '@/lib/types'

interface Props { roiConfig: RoiConfig | null }

export function RoiConfigSettings({ roiConfig }: Props) {
  const [state, action, pending] = useActionState(updateRoiConfig, null)

  // Exemplo: projeto de 100h, economia de R$3.000/mês
  const example = roiConfig
    ? calcProjectRoi(3000, 100, roiConfig.hourly_rate, roiConfig.overhead_multiplier)
    : null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Configuração de ROI</h2>

      <form action={action} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hourly_rate">Custo/hora (R$)</Label>
            <Input
              id="hourly_rate"
              name="hourly_rate"
              type="number"
              min="0"
              step="0.01"
              defaultValue={roiConfig?.hourly_rate ?? 150}
              required
            />
            <p className="text-xs text-slate-400">Valor médio da hora técnica</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="overhead_multiplier">Multiplicador de overhead</Label>
            <Input
              id="overhead_multiplier"
              name="overhead_multiplier"
              type="number"
              min="1"
              max="5"
              step="0.1"
              defaultValue={roiConfig?.overhead_multiplier ?? 1.3}
              required
            />
            <p className="text-xs text-slate-400">Encargos, benefícios, etc.</p>
          </div>
        </div>

        {example && (
          <div className="bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-4 py-3 text-sm">
            <p className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">Exemplo: 100h de dev, economia de R$3.000/mês</p>
            <div className="grid grid-cols-3 gap-3 text-emerald-700 dark:text-emerald-400">
              <div>
                <p className="text-xs text-emerald-500 dark:text-emerald-500">Custo dev</p>
                <p className="font-semibold">{formatCurrency(example.devCost)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-500">Economia anual</p>
                <p className="font-semibold">{formatCurrency(example.annualSavings)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-500">ROI (1 ano)</p>
                <p className="font-semibold">{example.roiPct}%</p>
              </div>
            </div>
          </div>
        )}

        {state?.error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">Configuração salva.</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={pending} className="gap-1.5">
            <Check className="size-3.5" /> {pending ? 'Salvando…' : 'Salvar configuração'}
          </Button>
        </div>
      </form>
    </section>
  )
}
