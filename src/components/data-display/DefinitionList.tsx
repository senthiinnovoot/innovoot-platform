import type { ReactNode } from 'react'

import { cn } from '@shared/utils/cn'

export interface DefinitionListItem {
  label: string
  value: ReactNode
}

export interface DefinitionListProps {
  items: DefinitionListItem[]
  className?: string
}

/**
 * Semantic list of label/value pairs — a real `<dl>` with `<dt>`/`<dd>`
 * (grouped in HTML5-valid wrapping `<div>`s). Independent from `KeyValue`
 * on purpose: different semantic context (a list vs. one standalone
 * pair), sharing only visual token classes, not DOM structure.
 */
export function DefinitionList({ items, className }: DefinitionListProps) {
  return (
    <dl className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5">
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="text-body-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
