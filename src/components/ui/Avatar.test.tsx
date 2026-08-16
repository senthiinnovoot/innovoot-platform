import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="/photo.jpg" name="Jane Doe" />)
    const img = screen.getByRole('img', { name: 'Jane Doe' })
    expect(img).toHaveAttribute('src', '/photo.jpg')
  })

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="/broken.jpg" name="Jane Doe" />)
    const img = screen.getByRole('img', { name: 'Jane Doe' })
    fireEvent.error(img)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders initials when there is no image', () => {
    render(<Avatar name="Jane Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('exposes an accessible name in the initials fallback (not just visible text)', () => {
    render(<Avatar name="Jane Doe" />)
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument()
  })

  it('renders a generic user icon when there is no image or name', () => {
    render(<Avatar alt="Unknown user" />)
    expect(screen.getByRole('img', { name: 'Unknown user' })).toBeInTheDocument()
  })

  it('does not expose a meaningless empty role="img" when there is no image, name, or alt', () => {
    render(<Avatar />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('is non-interactive: no button/link role and no tabIndex', () => {
    const { container } = render(<Avatar name="Jane Doe" />)
    const root = container.firstChild as HTMLElement
    expect(root.tagName).toBe('SPAN')
    expect(root).not.toHaveAttribute('tabindex')
  })

  it('applies the size variant class', () => {
    const { container } = render(<Avatar name="Jane Doe" size="lg" />)
    expect(container.firstChild).toHaveClass('size-14')
  })
})
