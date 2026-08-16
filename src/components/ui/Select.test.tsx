import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Select } from './Select'

function renderSelect(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  return render(
    <Select label="Country" {...props}>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </Select>,
  )
}

describe('Select', () => {
  it('associates a visible label with the select', () => {
    renderSelect()
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
  })

  it('renders the provided options', () => {
    renderSelect()
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument()
  })

  it('changes value on selection', async () => {
    const user = userEvent.setup()
    renderSelect()
    const select = screen.getByLabelText('Country')
    await user.selectOptions(select, 'ca')
    expect(select).toHaveValue('ca')
  })

  it('is keyboard-operable', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.tab()
    expect(screen.getByLabelText('Country')).toHaveFocus()
  })

  it('marks the field invalid and shows the error instead of the hint', () => {
    renderSelect({ hint: 'Pick one', error: 'Country is required' })
    const select = screen.getByLabelText('Country')
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Country is required')).toBeInTheDocument()
    expect(screen.queryByText('Pick one')).not.toBeInTheDocument()
  })

  it('is disabled when disabled', () => {
    renderSelect({ disabled: true })
    expect(screen.getByLabelText('Country')).toBeDisabled()
  })
})
