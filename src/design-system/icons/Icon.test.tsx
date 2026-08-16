import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Icon } from './Icon'

describe('Icon', () => {
  it('renders the icon for a given name', () => {
    const { container } = render(<Icon name="sun" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is hidden from assistive tech by default (decorative)', () => {
    const { container } = render(<Icon name="moon" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  it('becomes an accessible image when a label is provided', () => {
    render(<Icon name="user" label="User account" />)
    expect(screen.getByRole('img', { name: 'User account' })).toBeInTheDocument()
  })

  it('applies the size variant class', () => {
    const { container } = render(<Icon name="chevron-down" size="lg" />)
    expect(container.querySelector('svg')).toHaveClass('size-6')
  })

  it('defaults to the md size', () => {
    const { container } = render(<Icon name="chevron-down" />)
    expect(container.querySelector('svg')).toHaveClass('size-5')
  })

  it.each([
    'info',
    'circle-check',
    'triangle-alert',
    'circle-alert',
    'loader-circle',
    'x',
  ] as const)('renders the %s icon added for Phase 3B', (name) => {
    const { container } = render(<Icon name={name} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it.each(['bed', 'calendar', 'flask-conical', 'layout-dashboard', 'pill', 'users'] as const)(
    'renders the %s icon added for Phase 4A navigation',
    (name) => {
      const { container } = render(<Icon name={name} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    },
  )
})
