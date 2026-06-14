import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, parseISO, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null, pattern = 'dd/MM/yyyy') {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: ptBR })
}

export function formatCurrency(value: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function isDelayed(expectedDate: string | null, completedAt: string | null) {
  if (!expectedDate || completedAt) return false
  return isAfter(new Date(), parseISO(expectedDate))
}

export function leadTimeDays(createdAt: string, completedAt: string | null) {
  if (!completedAt) return null
  return differenceInDays(parseISO(completedAt), parseISO(createdAt))
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}
