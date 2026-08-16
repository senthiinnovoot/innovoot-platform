import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('renders a default title when none is provided', () => {
    render(<ErrorState />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders a custom title and description', () => {
    render(<ErrorState title="Failed to load customers" description="Check your connection." />)
    expect(screen.getByText('Failed to load customers')).toBeInTheDocument()
    expect(screen.getByText('Check your connection.')).toBeInTheDocument()
  })

  it('uses role="alert"', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders a retry button and calls onRetry when clicked', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(<ErrorState onRetry={onRetry} />)
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('omits the retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
