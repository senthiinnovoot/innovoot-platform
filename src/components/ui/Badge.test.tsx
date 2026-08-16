import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies the semantic variant class for status color', () => {
    render(<Badge variant="success">Active</Badge>)
    expect(screen.getByText('Active')).toHaveClass('bg-success')
  })
})
