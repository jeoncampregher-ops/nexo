import { cn } from '@/lib/utils'

interface Props {
  size?: number
  className?: string
}

/** Square icon — used for favicon, auth panel, small contexts */
export function NexoLogo({ size = 32, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      width={size}
      height={size}
      className={cn('flex-shrink-0', className)}
    >
      <rect width="32" height="32" rx="8" fill="#6366f1"/>
      <rect x="7" y="8" width="4" height="16" rx="1.5" fill="white"/>
      <rect x="21" y="8" width="4" height="16" rx="1.5" fill="white"/>
      <path d="M11 8.5 L21 23.5" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  )
}

/** Full wordmark — used in sidebar and larger contexts */
export function NexoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-black tracking-tight leading-none select-none', className)}>
      <span className="text-white">NEX</span>
      <span className="text-indigo-400">O</span>
    </span>
  )
}
