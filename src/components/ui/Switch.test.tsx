import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './Switch'

describe('Switch', () => {
  it('renders as a switch with an accessible label', () => {
    render(<Switch label="Enable notifications" />)
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument()
  })

  it('derives its accessible name from the required label prop', () => {
    render(<Switch label="Enable notifications" />)
    expect(screen.getByRole('switch')).toHaveAccessibleName('Enable notifications')
  })

  it('toggles uncontrolled state on click', async () => {
    const user = userEvent.setup()
    render(<Switch label="Enable notifications" />)
    const toggle = screen.getByRole('switch', { name: 'Enable notifications' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('respects defaultChecked', () => {
    render(<Switch label="Enable notifications" defaultChecked />)
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('behaves as controlled when checked is provided', async () => {
    const onCheckedChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Switch label="Enable notifications" checked={false} onCheckedChange={onCheckedChange} />,
    )
    const toggle = screen.getByRole('switch', { name: 'Enable notifications' })
    await user.click(toggle)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    // controlled: stays false since the `checked` prop wasn't updated by the parent
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('is activatable via Enter', async () => {
    const user = userEvent.setup()
    render(<Switch label="Enable notifications" />)
    await user.tab()
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('is activatable via Space', async () => {
    const user = userEvent.setup()
    render(<Switch label="Enable notifications" />)
    await user.tab()
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('is disabled and unclickable when disabled', async () => {
    const onCheckedChange = vi.fn()
    const user = userEvent.setup()
    render(<Switch label="Enable notifications" onCheckedChange={onCheckedChange} disabled />)
    const toggle = screen.getByRole('switch', { name: 'Enable notifications' })
    expect(toggle).toBeDisabled()
    await user.click(toggle)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
