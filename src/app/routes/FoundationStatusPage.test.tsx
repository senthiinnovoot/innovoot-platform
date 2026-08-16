import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FoundationStatusPage } from './FoundationStatusPage'

describe('FoundationStatusPage', () => {
  it('renders the foundation-ready heading', () => {
    render(<FoundationStatusPage />)
    expect(
      screen.getByRole('heading', { name: /architecture foundation ready/i }),
    ).toBeInTheDocument()
  })
})
