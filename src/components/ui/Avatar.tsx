import { type VariantProps, cva } from 'class-variance-authority'
import { type ImgHTMLAttributes, useState } from 'react'

import { Icon } from '@design-system/icons'
import { cn } from '@shared/utils/cn'

const avatarVariants = cva(
  'bg-muted text-muted-foreground relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'size-8 text-caption',
        md: 'size-10 text-body-sm',
        lg: 'size-14 text-body-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface AvatarProps
  extends
    Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'>,
    VariantProps<typeof avatarVariants> {
  src?: string
  /** Used both as the `<img>` alt text and to derive initials when there's no image. */
  name?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0]
  return initials.toUpperCase()
}

/**
 * Primitive, non-interactive avatar with a graceful fallback chain: image
 * → initials (derived from `name`) → generic user icon. Domain-agnostic —
 * no concept of which module's entity the image/name belongs to.
 *
 * Pass `name` (and/or `alt`) whenever the avatar represents a real
 * person/entity — it's the only source of the accessible name in the
 * initials and icon-fallback tiers. When rendering a real `<img>`, `alt`
 * (falling back to `name`) is used directly. When neither `alt` nor `name`
 * is available, the fallback renders as fully decorative rather than
 * exposing an empty/generic `role="img"` with nothing meaningful to
 * announce.
 */
export function Avatar({ className, src, name, size, alt, ...props }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(src) && !imageFailed
  const accessibleName = alt ?? name

  return (
    <span
      className={cn(avatarVariants({ size }), className)}
      {...(!showImage && accessibleName
        ? { role: 'img' as const, 'aria-label': accessibleName }
        : {})}
    >
      {showImage ? (
        <img
          src={src}
          alt={accessibleName ?? ''}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
          {...props}
        />
      ) : name ? (
        <span aria-hidden="true" className="font-medium">
          {getInitials(name)}
        </span>
      ) : (
        <Icon name="user" />
      )}
    </span>
  )
}
