import type { ReactNode } from 'react'

import { cn } from '@shared/utils/cn'

export interface TimelineItem {
  id: string
  title: ReactNode
  description?: ReactNode
  /** Pre-formatted by the caller — this component does no date formatting itself. */
  timestamp?: ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

/**
 * Generic vertical sequence of events (e.g. an activity log). A real
 * `<ol>` since order is semantically meaningful. No date formatting,
 * status colors, or domain-specific item types — those are the
 * consuming module's responsibility, not this component's.
 */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('flex flex-col', className)}>
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span aria-hidden="true" className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" />
            {index < items.length - 1 && (
              <span aria-hidden="true" className="bg-border w-px flex-1" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 pb-4">
            {item.timestamp && (
              <span className="text-caption text-muted-foreground">{item.timestamp}</span>
            )}
            <span className="text-body-sm text-foreground font-medium">{item.title}</span>
            {item.description && (
              <span className="text-body-sm text-muted-foreground">{item.description}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
