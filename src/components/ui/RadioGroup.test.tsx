import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('RadioGroup', () => {
  it('renders a fieldset with the group label as legend', () => {
    render(<RadioGroup label="Choose one" options={options} />)
    expect(screen.getByRole('group', { name: 'Choose one' })).toBeInTheDocument()
  })

  it('renders one radio per option, each labelled', () => {
    render(<RadioGroup label="Choose one" options={options} />)
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument()
  })

  it('supports uncontrolled usage via defaultValue', () => {
    render(<RadioGroup label="Choose one" options={options} defaultValue="b" />)
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Option A' })).not.toBeChecked()
  })

  it('supports controlled usage via value + onValueChange', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(
      <RadioGroup label="Choose one" options={options} value="a" onValueChange={onValueChange} />,
    )
    await user.click(screen.getByRole('radio', { name: 'Option B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('is keyboard-navigable between options', async () => {
    const user = userEvent.setup()
    render(<RadioGroup label="Choose one" options={options} defaultValue="a" />)
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Option B' })).toHaveFocus()
  })

  it('marks the field invalid and shows the error instead of the hint', () => {
    render(
      <RadioGroup
        label="Choose one"
        options={options}
        hint="Pick a plan"
        error="Selection required"
      />,
    )
    expect(screen.getByRole('group')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Selection required')).toBeInTheDocument()
    expect(screen.queryByText('Pick a plan')).not.toBeInTheDocument()
  })

  it('disables all options when disabled', () => {
    render(<RadioGroup label="Choose one" options={options} disabled />)
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeDisabled()
  })
})
