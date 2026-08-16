import { type TextareaHTMLAttributes, useId } from 'react'

import { cn } from '@shared/utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label text — see `Input` for why this is optional rather than required. */
  label?: string
  /** Helper text shown below the textarea, associated via `aria-describedby`. */
  hint?: string
  /** Error message — implies `aria-invalid` and takes over the hint slot. */
  error?: string
}

/**
 * Primitive multi-line text input — structurally identical to `Input`
 * (label/hint/error/`aria-describedby`/`aria-invalid`) so the two stay
 * interchangeable in a form without relearning a different API.
 */
export function Textarea({ className, label, hint, error, id, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const hintId = hint ? `${textareaId}-hint` : undefined
  const errorId = error ? `${textareaId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-label text-foreground font-medium">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          'border-input bg-surface text-body-md text-foreground min-h-24 resize-y rounded-md border px-3 py-2',
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
