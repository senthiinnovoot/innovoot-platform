import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No customers yet" />)
    expect(screen.getByText('No customers yet')).toBeInTheDocument()
  })

  it('renders an optional description', () => {
    render(<EmptyState title="No customers yet" description="Add your first customer to begin." />)
    expect(screen.getByText('Add your first customer to begin.')).toBeInTheDocument()
  })

  it('omits the description when not provided', () => {
    render(<EmptyState title="No customers yet" />)
    expect(screen.queryByText('Add your first customer to begin.')).not.toBeInTheDocument()
  })

  it('renders an optional action slot', () => {
    render(
      <EmptyState title="No customers yet" action={<button type="button">Add customer</button>} />,
    )
    expect(screen.getByRole('button', { name: 'Add customer' })).toBeInTheDocument()
  })

  it('has no live region — it is static page content, not a dynamic announcement', () => {
    render(<EmptyState title="No customers yet" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
