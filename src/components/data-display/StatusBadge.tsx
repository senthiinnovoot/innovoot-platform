import type { ReactNode } from 'react'

import { Badge, type BadgeProps } from '@components/ui'
import { cn } from '@shared/utils/cn'

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const badgeVariantByStatus: Record<StatusTone, NonNullable<BadgeProps['variant']>> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'default',
}

const dotColorByStatus: Record<StatusTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  neutral: 'bg-muted-foreground',
}

export interface StatusBadgeProps {
  status: StatusTone
  children: ReactNode
  className?: string
}

/**
 * Generic state indicator — a semantic tone (`success`/`warning`/`error`/
 * `info`/`neutral`) plus whatever label text the consuming module chooses
 * (e.g. "Active", "Shipped", "Draft"). Composes the existing `Badge`
 * rather than reimplementing it; adds a leading status dot to distinguish
 * "this represents a state" from a plain tag/label use of `Badge`.
 */
export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge variant={badgeVariantByStatus[status]} className={cn('gap-1.5', className)}>
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', dotColorByStatus[status])} />
      {children}
    </Badge>
  )
}
