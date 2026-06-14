import { cn, initials } from '@/lib/utils'
import type { Profile } from '@/lib/types'

interface Props {
  user: Pick<Profile, 'full_name' | 'avatar_url'> | null | undefined
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'size-6 text-[10px]', md: 'size-8 text-xs', lg: 'size-10 text-sm' }

export function UserAvatar({ user, size = 'md', className }: Props) {
  if (!user) return null

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.full_name}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-indigo-500 text-white font-semibold flex items-center justify-center flex-shrink-0',
        sizeMap[size],
        className
      )}
      title={user.full_name}
    >
      {initials(user.full_name)}
    </div>
  )
}
