import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and resolve conflicting Tailwind utility
 * classes (e.g. `cn('p-2', condition && 'p-4')` correctly keeps only
 * `p-4`, rather than emitting both and letting CSS source order decide).
 *
 * Use this instead of manual template-string class concatenation in any
 * component that has conditional or variant-driven classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
