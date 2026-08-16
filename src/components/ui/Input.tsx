import { type InputHTMLAttributes, useId } from 'react'

import { cn } from '@shared/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Visible label text. Required in spirit — an input without a
   * discoverable label fails the accessibility rules in CLAUDE.md — but
   * typed as optional so a pre-labelled input (via `aria-labelledby`) can
   * still opt out deliberately rather than being forced into a redundant
   * label.
   */
  label?: string
  /** Helper text shown below the input, associated via `aria-describedby`. */
  hint?: string
  /** Error message — implies `aria-invalid` and takes over the hint slot. */
  error?: string
}

/**
 * Primitive text input with a properly associated label, hint, and error
 * state. Build module-specific fields (e.g. a validated "Customer email"
 * field wired to react-hook-form) on top of this rather than styling a
 * bare `<input>` again — see components/forms/ once that layer exists.
 */
export function Input({ className, label, hint, error, id, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label text-foreground font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          'border-input bg-surface text-body-md text-foreground h-10 rounded-md border px-3',
          'placeholder:text-muted-foreground',
          'transition-colors duration-150 ease-in-out',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus-visible:ring-error',
          className,
        )}
        {...props}
      />
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
