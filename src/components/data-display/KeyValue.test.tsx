import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KeyValue } from './KeyValue'

describe('KeyValue', () => {
  it('renders the label and value', () => {
    render(<KeyValue label="Email" value="jane@example.com" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('accepts a non-text value', () => {
    render(<KeyValue label="Status" value={<span data-testid="custom-value">Active</span>} />)
    expect(screen.getByTestId('custom-value')).toBeInTheDocument()
  })

  it('does not use dt/dd — it is not valid outside a dl', () => {
    const { container } = render(<KeyValue label="Email" value="jane@example.com" />)
    expect(container.querySelector('dt')).not.toBeInTheDocument()
    expect(container.querySelector('dd')).not.toBeInTheDocument()
  })
})
