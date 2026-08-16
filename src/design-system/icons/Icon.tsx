import { type VariantProps, cva } from 'class-variance-authority'
import { type ClassValue, clsx } from 'clsx'
import { ChevronDown, Moon, Sun, User } from 'lucide-react'
import type { SVGProps } from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * `design-system/` is the foundation layer and may not depend on `shared/`
 * (see docs/architecture/dependency-rules.md), so this uses `clsx` +
 * `tailwind-merge` directly rather than importing `shared/utils/cn` —
 * same two libraries `cn()` wraps, just inlined at this one boundary.
 */
function cx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Curated, typed map of the only Lucide icons this project uses — the
 * single point where the `lucide-react` dependency is imported. Add an
 * entry here (import + map key) when a component needs a new icon; do not
 * import `lucide-react` anywhere else.
 */
const icons = {
  'chevron-down': ChevronDown,
  sun: Sun,
  moon: Moon,
  user: User,
} as const

export type IconName = keyof typeof icons

const iconVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface IconProps
  extends
    Omit<SVGProps<SVGSVGElement>, 'ref' | 'width' | 'height'>,
    VariantProps<typeof iconVariants> {
  name: IconName
  /**
   * Presence promotes the icon from decorative to meaningful: renders
   * `role="img"` + `aria-label` instead of `aria-hidden`. Omit for icons
   * that only decorate visible text or an already-labelled control.
   */
  label?: string
}

/** Icon primitive — the only sanctioned way to render a Lucide icon in this project. */
export function Icon({ name, size, label, className, ...props }: IconProps) {
  const Component = icons[name]
  const a11yProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const }

  return <Component className={cx(iconVariants({ size }), className)} {...a11yProps} {...props} />
}
