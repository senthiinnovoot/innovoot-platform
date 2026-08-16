import { useId } from 'react'

import { cn } from '@shared/utils/cn'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  /** Group legend — associates via native `<fieldset>`/`<legend>`, no manual aria wiring needed. */
  label: string
  hint?: string
  error?: string
  name?: string
  options: RadioOption[]
  /** Controlled value. Omit and use `defaultValue` for uncontrolled usage. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'vertical' | 'horizontal'
  disabled?: boolean
  className?: string
}

/**
 * Primitive radio group. Uses a native `<fieldset>`/`<legend>` for group
 * semantics and native `<input type="radio">` per option, styled via
 * `accent-primary` — same reasoning as `Checkbox`.
 */
export function RadioGroup({
  label,
  hint,
  error,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  disabled,
  className,
}: RadioGroupProps) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const groupId = useId()
  const hintId = hint ? `${groupId}-hint` : undefined
  const errorId = error ? `${groupId}-error` : undefined

  return (
    <fieldset
      className={cn('flex flex-col gap-1.5 border-0 p-0', className)}
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
    >
      <legend className="text-label text-foreground mb-1 font-medium">{label}</legend>
      <div
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                id={optionId}
                name={groupName}
                value={option.value}
                disabled={disabled || option.disabled}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={
                  value === undefined && defaultValue !== undefined
                    ? defaultValue === option.value
                    : undefined
                }
                onChange={(event) => {
                  if (event.target.checked) onValueChange?.(option.value)
                }}
                className={cn(
                  'border-input accent-primary size-4 border',
                  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
              <label htmlFor={optionId} className="text-body-sm text-foreground">
                {option.label}
              </label>
            </div>
          )
        })}
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
    </fieldset>
  )
}
