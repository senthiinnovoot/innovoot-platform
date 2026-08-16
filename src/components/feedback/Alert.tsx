import { type VariantProps, cva } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { Icon, type IconName } from '@design-system/icons'
import { cn } from '@shared/utils/cn'

const alertVariants = cva('flex gap-3 rounded-md border p-4', {
  variants: {
    variant: {
      info: 'border-info/20 bg-info/10 text-foreground',
      success: 'border-success/20 bg-success/10 text-foreground',
      warning: 'border-warning/20 bg-warning/10 text-foreground',
      error: 'border-error/20 bg-error/10 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const iconByVariant: Record<NonNullable<AlertProps['variant']>, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-alert',
}

const iconColorByVariant: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  title?: string
}

/**
 * Static, inline status message — not a transient notification (see
 * `Toast` for that). State is always conveyed by icon + text together,
 * never color alone. `error` uses `role="alert"` (assertive) since a
 * failure is exactly the kind of thing that should interrupt; the other
 * variants use `role="status"` (polite).
 */
export function Alert({ className, variant, title, children, ...props }: AlertProps) {
  const resolvedVariant = variant ?? 'info'

  return (
    <div
      role={resolvedVariant === 'error' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon
        name={iconByVariant[resolvedVariant]}
        className={cn('mt-0.5', iconColorByVariant[resolvedVariant])}
      />
      <div className="flex flex-col gap-1">
        {title && <p className="text-body-sm font-medium">{title}</p>}
        <div className="text-body-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
