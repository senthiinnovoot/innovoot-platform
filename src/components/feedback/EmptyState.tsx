import type { ReactNode } from 'react'

import { cn } from '@shared/utils/cn'

export interface EmptyStateProps {
  title: string
  description?: string
  /** e.g. a `Button` for "Create new…" — no API/action logic lives here. */
  action?: ReactNode
  className?: string
}

/**
 * Generic "no data" placeholder — zero results, not an error (see
 * `ErrorState` for that). Static page content, not a dynamic announcement,
 * so no live region — semantic heading + text is sufficient.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 p-6 text-center', className)}>
      <p className="text-heading-sm text-foreground font-semibold">{title}</p>
      {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
