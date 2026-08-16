import { type SelectHTMLAttributes, useId } from 'react'

import { Icon } from '@design-system/icons'
import { cn } from '@shared/utils/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label text — see `Input` for why this is optional rather than required. */
  label?: string
  /** Helper text shown below the select, associated via `aria-describedby`. */
  hint?: string
  /** Error message — implies `aria-invalid` and takes over the hint slot. */
  error?: string
  /** `<option>` / `<optgroup>` elements — native composition, no invented options-array shape. */
  children: React.ReactNode
}

/**
 * Primitive select. Wraps the native `<select>` (full keyboard/screen-reader
 * support for free) rather than a custom listbox — see CLAUDE.md's
 * accessibility rules ("prefer semantic HTML elements... where a native
 * element already provides the right semantics and behavior") for why this
 * project prefers native controls over rebuilding accessible widgets from
 * scratch.
 */
export function Select({ className, label, hint, error, id, children, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const hintId = hint ? `${selectId}-hint` : undefined
  const errorId = error ? `${selectId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-label text-foreground font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'border-input bg-surface text-body-md text-foreground h-10 w-full appearance-none rounded-md border px-3 pr-9',
            'transition-colors duration-150 ease-in-out',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus-visible:ring-error',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          size="sm"
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        />
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
