import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders the label text from children', () => {
    render(<StatusBadge status="success">Active</StatusBadge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('maps each status tone to a distinct Badge variant class', () => {
    const { rerender } = render(<StatusBadge status="success">Active</StatusBadge>)
    expect(screen.getByText('Active')).toHaveClass('bg-success')

    rerender(<StatusBadge status="error">Failed</StatusBadge>)
    expect(screen.getByText('Failed')).toHaveClass('bg-error')

    rerender(<StatusBadge status="neutral">Draft</StatusBadge>)
    expect(screen.getByText('Draft')).toHaveClass('bg-secondary')
  })

  it('does not rely on color alone — pairs the tone with a status dot', () => {
    const { container } = render(<StatusBadge status="warning">Pending</StatusBadge>)
    expect(container.querySelector('.bg-warning.rounded-full')).toBeInTheDocument()
  })
})
