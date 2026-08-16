import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('associates a visible label with the checkbox', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument()
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Accept terms" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('is keyboard-toggleable', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Accept terms" />)
    await user.tab()
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked()
  })

  it('calls onChange when toggled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox label="Accept terms" onChange={onChange} />)
    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }))
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('is disabled and unclickable when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox label="Accept terms" onChange={onChange} disabled />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).toBeDisabled()
    await user.click(checkbox)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks the field invalid and shows the error instead of the hint', () => {
    render(<Checkbox label="Accept terms" hint="Required to continue" error="You must accept" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('You must accept')).toBeInTheDocument()
    expect(screen.queryByText('Required to continue')).not.toBeInTheDocument()
  })
})
