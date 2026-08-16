import { Icon } from '@design-system/icons'
import { Button } from '@components/ui'
import { cn } from '@shared/utils/cn'

export interface ErrorStateProps {
  title?: string
  description?: string
  /** Renders a "Try again" button when provided. No fetch/query logic here — the caller retries. */
  onRetry?: () => void
  className?: string
}

/**
 * Generic data-fetch failure placeholder. Deliberately has no knowledge of
 * HTTP status codes, API shapes, or React Query — that belongs to the
 * module/service layer, not this presentational component.
 */
export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center gap-2 p-6 text-center', className)}>
      <Icon name="circle-alert" size="lg" className="text-error" />
      <p className="text-heading-sm text-foreground font-semibold">{title}</p>
      {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
