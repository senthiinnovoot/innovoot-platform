import { Icon, type IconName } from '@design-system/icons'
import { cn } from '@shared/utils/cn'

import type { ToastVariant } from './useToast'

export interface ToastProps {
  variant?: ToastVariant
  title?: string
  description?: string
  onDismiss: () => void
}

const iconByVariant: Record<ToastVariant, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-alert',
}

const iconColorByVariant: Record<ToastVariant, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

/**
 * Presentational single toast. Deliberately carries no `role="status"`/
 * `"alert"` of its own — `Toaster` owns exactly one shared live region for
 * the whole stack, so an individual `Toast` announcing itself again would
 * double-announce.
 */
export function Toast({ variant = 'info', title, description, onDismiss }: ToastProps) {
  return (
    <div className="bg-surface-elevated border-border flex w-full max-w-sm gap-3 rounded-md border p-4 shadow-md">
      <Icon name={iconByVariant[variant]} className={cn('mt-0.5', iconColorByVariant[variant])} />
      <div className="flex flex-1 flex-col gap-1">
        {title && <p className="text-body-sm text-foreground font-medium">{title}</p>}
        {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'text-muted-foreground hover:text-foreground shrink-0 rounded-sm',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        )}
      >
        <Icon name="x" size="sm" />
      </button>
    </div>
  )
}
