import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('associates a visible label with the textarea', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Notes" />)
    const textarea = screen.getByLabelText('Notes')
    await user.type(textarea, 'Hello world')
    expect(textarea).toHaveValue('Hello world')
  })

  it('associates hint text via aria-describedby', () => {
    render(<Textarea label="Notes" hint="Max 500 characters" />)
    const textarea = screen.getByLabelText('Notes')
    expect(screen.getByText('Max 500 characters')).toHaveAttribute(
      'id',
      textarea.getAttribute('aria-describedby'),
    )
  })

  it('marks the field invalid and shows the error instead of the hint', () => {
    render(<Textarea label="Notes" hint="Max 500 characters" error="Notes are required" />)
    const textarea = screen.getByLabelText('Notes')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Notes are required')).toBeInTheDocument()
    expect(screen.queryByText('Max 500 characters')).not.toBeInTheDocument()
  })

  it('is disabled and unfocusable when disabled', () => {
    render(<Textarea label="Notes" disabled />)
    expect(screen.getByLabelText('Notes')).toBeDisabled()
  })
})
