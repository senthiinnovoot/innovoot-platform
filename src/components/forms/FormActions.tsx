import type { HTMLAttributes } from 'react'

import { cn } from '@shared/utils/cn'

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Alignment of the action buttons. Defaults to `'end'` (primary action right-aligned). */
  align?: 'start' | 'end' | 'between'
}

const alignClasses = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
} as const

/**
 * Thin, domain-agnostic layout for a form's action buttons (submit/cancel).
 * Mobile-first: stacks full-width on narrow viewports, row-aligned above
 * the `sm` breakpoint.
 */
export function FormActions({ className, align = 'end', children, ...props }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:items-center',
        alignClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
