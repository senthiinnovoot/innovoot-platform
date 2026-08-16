import { type ButtonHTMLAttributes, useState } from 'react'

import { cn } from '@shared/utils/cn'

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value'
> {
  /** Controlled checked state. Omit and use `defaultChecked` for uncontrolled usage. */
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /**
   * Accessible label — required. There is no visible label slot, so this
   * is the switch's only source of an accessible name; a `Switch` must
   * never render without one.
   */
  label: string
}

/**
 * Primitive toggle switch. No native `<input type="switch">` exists, so
 * this is the one `ui/` primitive built on ARIA (`role="switch"`) instead
 * of a native form control — a real `<button>` still gives keyboard
 * support (Enter/Space) for free.
 */
export function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  ...props
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : uncontrolledChecked

  function toggle() {
    const next = !isChecked
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        'focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        isChecked ? 'bg-primary' : 'bg-muted',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'bg-surface pointer-events-none block size-5 rounded-full shadow-sm transition-transform duration-150 ease-in-out motion-reduce:transition-none',
          isChecked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}
