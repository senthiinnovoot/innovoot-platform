import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { Toaster } from './Toaster'
import { useToastStore } from './useToast'

function resetStore() {
  useToastStore.setState({ toasts: [] })
}

describe('Toaster', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders exactly one live region', () => {
    render(<Toaster />)
    act(() => {
      useToastStore.getState().show({ title: 'Saved', duration: 0 })
    })
    expect(screen.getAllByRole('region', { name: 'Notifications' })).toHaveLength(1)
  })

  it('keeps multiple toasts inside the same live region, not duplicate regions', () => {
    render(<Toaster />)
    act(() => {
      useToastStore.getState().show({ title: 'First', duration: 0 })
      useToastStore.getState().show({ title: 'Second', duration: 0 })
    })
    expect(screen.getAllByRole('region', { name: 'Notifications' })).toHaveLength(1)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('removes a toast from the DOM when it is dismissed', async () => {
    const user = userEvent.setup()
    render(<Toaster />)
    act(() => {
      useToastStore.getState().show({ title: 'Saved', duration: 0 })
    })
    expect(screen.getByText('Saved')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('renders nothing visible when there are no active toasts', () => {
    render(<Toaster />)
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument()
  })
})
