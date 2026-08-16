import { type InputHTMLAttributes, useId } from 'react'

import { cn } from '@shared/utils/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label, rendered beside the box rather than above it. */
  label?: string
  /** Helper text shown below, associated via `aria-describedby`. */
  hint?: string
  /** Error message — implies `aria-invalid` and takes over the hint slot. */
  error?: string
}

/**
 * Primitive checkbox. Uses the native control styled via `accent-primary`
 * rather than hiding it behind a custom SVG box — the browser already
 * draws an accessible, keyboard-operable check mark for free.
 *
 * `indeterminate` is intentionally not supported yet — it needs imperative
 * DOM access (it's a JS property, not an HTML attribute) and has no real
 * consumer until DataTable row-selection exists.
 */
export function Checkbox({ className, label, hint, error, id, ...props }: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const hintId = hint ? `${checkboxId}-hint` : undefined
  const errorId = error ? `${checkboxId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'border-input accent-primary size-4 rounded-sm border',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error',
            className,
          )}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-label text-foreground font-medium">
            {label}
          </label>
        )}
      </div>
      {error ? (
        <p id={errorId} className="text-caption text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
