import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from './Input'

describe('Input', () => {
  it('associates the label with the input for screen readers', () => {
    render(<Input label="Email address" />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('associates hint text via aria-describedby', () => {
    render(<Input label="Email address" hint="We'll never share this." />)
    const input = screen.getByLabelText('Email address')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent("We'll never share this.")
  })

  it('marks the input invalid and surfaces the error message when `error` is set', () => {
    render(<Input label="Email address" error="Email is required" />)
    const input = screen.getByLabelText('Email address')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })
})
