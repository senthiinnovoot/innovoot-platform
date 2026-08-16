import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Toast } from './Toast'

describe('Toast', () => {
  it('renders an accessible title and description', () => {
    render(<Toast title="Saved" description="Your changes have been saved." onDismiss={vi.fn()} />)
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument()
  })

  it('renders a labelled dismiss button', () => {
    render(<Toast title="Saved" onDismiss={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument()
  })

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<Toast title="Saved" onDismiss={onDismiss} />)
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('is dismissible via the keyboard', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<Toast title="Saved" onDismiss={onDismiss} />)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it.each([
    ['success', 'lucide-circle-check'],
    ['warning', 'lucide-triangle-alert'],
    ['error', 'lucide-circle-alert'],
    ['info', 'lucide-info'],
  ] as const)(
    'renders a distinct icon for the %s variant, not color alone',
    (variant, iconClass) => {
      const { container } = render(
        <Toast variant={variant} title="Status update" onDismiss={vi.fn()} />,
      )
      expect(container.querySelector(`svg.${iconClass}`)).toBeInTheDocument()
    },
  )

  it('does not render its own live region — Toaster owns the single shared region', () => {
    render(<Toast title="Saved" onDismiss={vi.fn()} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
