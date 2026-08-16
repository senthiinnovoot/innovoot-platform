import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Timeline } from './Timeline'

const items = [
  { id: '1', title: 'Order placed', timestamp: 'Jan 1' },
  { id: '2', title: 'Order shipped', description: 'Via courier', timestamp: 'Jan 3' },
]

describe('Timeline', () => {
  it('renders a real <ol> since order is meaningful', () => {
    const { container } = render(<Timeline items={items} />)
    expect(container.querySelector('ol')).toBeInTheDocument()
  })

  it('renders one list item per entry', () => {
    const { container } = render(<Timeline items={items} />)
    expect(container.querySelectorAll('li')).toHaveLength(2)
  })

  it('renders title, description, and timestamp content', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('Order placed')).toBeInTheDocument()
    expect(screen.getByText('Order shipped')).toBeInTheDocument()
    expect(screen.getByText('Via courier')).toBeInTheDocument()
    expect(screen.getByText('Jan 1')).toBeInTheDocument()
  })

  it('omits the description when not provided', () => {
    render(<Timeline items={items} />)
    // first item has no description — only the second item's description text should exist
    expect(screen.getAllByText('Via courier')).toHaveLength(1)
  })

  it('renders an empty timeline without error when given no items', () => {
    const { container } = render(<Timeline items={[]} />)
    expect(container.querySelector('ol')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})
