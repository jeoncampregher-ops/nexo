'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Popover } from '@base-ui/react/popover'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface DatePickerProps {
  name: string
  placeholder?: string
  className?: string
  onSelect?: () => void
}

export function DatePicker({ name, placeholder = 'Selecione a data', className, onSelect }: DatePickerProps) {
  const [selected, setSelected] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState(new Date())
  const [open, setOpen] = useState(false)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const isoValue = selected ? format(selected, 'yyyy-MM-dd') : ''
  const displayValue = selected ? format(selected, 'dd/MM/yyyy', { locale: ptBR }) : null

  const handleSelect = (day: Date) => {
    setSelected(day)
    setOpen(false)
    onSelect?.()
  }

  return (
    <>
      <input type="hidden" name={name} value={isoValue} />

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          className={cn(
            'flex items-center gap-2.5 w-full h-10 rounded-xl border border-slate-200 bg-white shadow-sm px-3 text-[13px] transition-all outline-none cursor-pointer',
            'hover:border-slate-300 focus-visible:border-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-100',
            displayValue ? 'text-slate-700' : 'text-slate-300',
            className
          )}
        >
          <Calendar className="size-3.5 text-slate-300 shrink-0" />
          <span className="flex-1 text-left truncate">{displayValue ?? placeholder}</span>
          <ChevronDown className={cn('size-3.5 text-slate-400 transition-transform shrink-0', open && 'rotate-180')} />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner
            side="bottom"
            align="start"
            sideOffset={6}
            className="z-[200]"
          >
            <Popover.Popup className="w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 p-4 outline-none">

              {/* Navegação do mês */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setViewMonth((m) => subMonths(m, 1))}
                  className="size-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ChevronLeft className="size-3.5" />
                </button>

                <span className="text-[13px] font-semibold text-slate-800 capitalize select-none">
                  {format(viewMonth, 'MMMM yyyy', { locale: ptBR })}
                </span>

                <button
                  type="button"
                  onClick={() => setViewMonth((m) => addMonths(m, 1))}
                  className="size-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>

              {/* Cabeçalho dias da semana */}
              <div className="grid grid-cols-7 mb-1">
                {DOW.map((d, i) => (
                  <div
                    key={i}
                    className="h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Grade de dias */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {days.map((day) => {
                  const isSelected = selected && isSameDay(day, selected)
                  const isCurrentMonth = isSameMonth(day, viewMonth)
                  const todayDay = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleSelect(day)}
                      className={cn(
                        'h-9 w-full flex items-center justify-center rounded-lg text-[13px] transition-all',
                        isSelected && 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-500/30',
                        !isSelected && todayDay && isCurrentMonth && 'text-indigo-600 font-semibold bg-indigo-50',
                        !isSelected && isCurrentMonth && !todayDay && 'text-slate-700 hover:bg-slate-100',
                        !isSelected && !isCurrentMonth && 'text-slate-300 hover:text-slate-400',
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>

              {/* Rodapé */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={() => { setSelected(new Date()); setViewMonth(new Date()); setOpen(false) }}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Hoje
                </button>
              </div>

            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}
