import type { ReactNode } from 'react'

import { cn } from '@shared/utils/cn'

export interface KeyValueProps {
  label: string
  value: ReactNode
  className?: string
}

/**
 * Generic, purely visual label/value pair for standalone use (e.g. beside
 * a card title). Deliberately not `<dt>`/`<dd>` — those are only valid
 * inside a `<dl>`, which would be incorrect HTML here. Reach for
 * `DefinitionList` instead when displaying a semantic list of several
 * pairs together.
 */
export function KeyValue({ label, value, className }: KeyValueProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-caption text-muted-foreground">{label}</span>
      <span className="text-body-sm text-foreground">{value}</span>
    </div>
  )
}
