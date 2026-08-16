import { type ReactNode, useId } from 'react'

import { cn } from '@shared/utils/cn'

export interface FormFieldRenderProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

export interface FormFieldProps {
  label?: string
  required?: boolean
  hint?: string
  error?: string
  /** Overrides the generated id — useful when the caller needs to know it upfront. */
  id?: string
  className?: string
  /**
   * Render-prop, not `ReactNode` — makes the id/ARIA wiring explicit and
   * typed at the call site instead of silently injecting props via
   * `cloneElement`. Spread the given object onto the rendered control:
   * `{(field) => <SomeControl {...field} />}`.
   *
   * Use a control's own `label`/`hint`/`error` props directly for the
   * simple case (see `Input`) — reach for `FormField` when composing a
   * control that doesn't self-label, or when a field needs a layout
   * consistent with others regardless of which control it wraps. Don't mix
   * both accessibility systems on the same control.
   */
  children: (field: FormFieldRenderProps) => ReactNode
}

/**
 * Presentational, form-library-agnostic field wrapper — label, required
 * indicator, hint/error text, and the id/ARIA relationship connecting them
 * to whatever control `children` renders. No react-hook-form coupling: see
 * CLAUDE.md's component conventions (composite UI stays "generic
 * composition of primitives... domain-agnostic") for why business/library
 * coupling stays out of this layer.
 */
export function FormField({
  label,
  required,
  hint,
  error,
  id,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined

  const field: FormFieldRenderProps = {
    id: fieldId,
    'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-required': required ? true : undefined,
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-label text-foreground font-medium">
          {label}
          {required && (
            <span aria-hidden="true" className="text-error ml-0.5">
              *
            </span>
          )}
        </label>
      )}
      {children(field)}
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
