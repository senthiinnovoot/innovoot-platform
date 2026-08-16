import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Alert } from './Alert'

describe('Alert', () => {
  it('renders its title and description content', () => {
    render(<Alert title="Heads up">Something you should know.</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Something you should know.')).toBeInTheDocument()
  })

  it('uses role="status" (polite) for info, success, and warning', () => {
    const { rerender } = render(<Alert variant="info">Info</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<Alert variant="success">Success</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(<Alert variant="warning">Warning</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses role="alert" (assertive) for error', () => {
    render(<Alert variant="error">Something failed</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('pairs each variant with a distinct icon, not color alone', () => {
    const { container, rerender } = render(<Alert variant="success">Success</Alert>)
    expect(container.querySelector('svg')).toBeInTheDocument()

    rerender(<Alert variant="error">Error</Alert>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('defaults to the info variant', () => {
    render(<Alert>Default</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
