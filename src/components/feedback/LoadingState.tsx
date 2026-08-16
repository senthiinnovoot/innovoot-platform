import { Icon } from '@design-system/icons'
import { cn } from '@shared/utils/cn'

export interface LoadingStateProps {
  /** Accessible + visible loading message. */
  label?: string
  className?: string
}

/**
 * Generic loading placeholder for a data-fetching region. The spinner is
 * decorative (`Icon` defaults to `aria-hidden`) — the `label` text is what
 * actually carries the accessible announcement, via `role="status"`.
 * Spin animation uses Tailwind's built-in `animate-spin`; no second motion
 * system — the project's global `prefers-reduced-motion` override in
 * `index.css` already neutralizes it (forces `animation-duration` to
 * ~0 and `animation-iteration-count` to 1), so reduced-motion users get a
 * single static frame instead of continuous spinning, with no per-component
 * handling needed.
 */
export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('text-muted-foreground flex flex-col items-center gap-2 p-6', className)}
    >
      <Icon name="loader-circle" size="lg" className="animate-spin" />
      <p className="text-body-sm">{label}</p>
    </div>
  )
}
