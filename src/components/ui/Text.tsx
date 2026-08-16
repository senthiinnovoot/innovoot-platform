import { type VariantProps, cva } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@shared/utils/cn'

const textVariants = cva('font-sans text-foreground', {
  variants: {
    variant: {
      'display-lg': 'text-display-lg font-semibold',
      'display-md': 'text-display-md font-semibold',
      'display-sm': 'text-display-sm font-semibold',
      'heading-xl': 'text-heading-xl font-semibold',
      'heading-lg': 'text-heading-lg font-semibold',
      'heading-md': 'text-heading-md font-semibold',
      'heading-sm': 'text-heading-sm font-semibold',
      'body-lg': 'text-body-lg font-normal',
      'body-md': 'text-body-md font-normal',
      'body-sm': 'text-body-sm font-normal',
      caption: 'text-caption font-normal text-muted-foreground',
      label: 'text-label font-medium',
    },
  },
  defaultVariants: {
    variant: 'body-md',
  },
})

/**
 * The default HTML element per variant — deliberately separate from the
 * `variant` (visual style), since document structure (which heading level
 * is correct here) and visual size are independent concerns. Override via
 * the `as` prop when a variant's default tag isn't right for the context
 * (e.g. a `heading-sm`-styled `<h2>` inside a section that already used
 * `heading-lg` for its `<h1>`).
 */
const defaultElement: Record<NonNullable<TextProps['variant']>, ElementType> = {
  'display-lg': 'h1',
  'display-md': 'h1',
  'display-sm': 'h2',
  'heading-xl': 'h2',
  'heading-lg': 'h3',
  'heading-md': 'h4',
  'heading-sm': 'h5',
  'body-lg': 'p',
  'body-md': 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'span',
}

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  /** Override the rendered element — see `defaultElement` above for why this is separate from `variant`. */
  as?: ElementType
}

/** Typography primitive — the only place font-size/weight for body copy should be set directly. */
export function Text({ className, variant, as, ...props }: TextProps) {
  const resolvedVariant = variant ?? 'body-md'
  const Component = as ?? defaultElement[resolvedVariant]
  return (
    <Component className={cn(textVariants({ variant: resolvedVariant }), className)} {...props} />
  )
}
