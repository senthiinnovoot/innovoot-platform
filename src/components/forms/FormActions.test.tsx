import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormActions } from './FormActions'

describe('FormActions', () => {
  it('renders its children', () => {
    render(
      <FormActions>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </FormActions>,
    )
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('defaults to end alignment', () => {
    const { container } = render(
      <FormActions>
        <button type="submit">Save</button>
      </FormActions>,
    )
    expect(container.firstChild).toHaveClass('justify-end')
  })

  it('applies the requested alignment', () => {
    const { container } = render(
      <FormActions align="between">
        <button type="submit">Save</button>
      </FormActions>,
    )
    expect(container.firstChild).toHaveClass('justify-between')
  })
})
