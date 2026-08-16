import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('renders composed slots', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Customer overview</CardTitle>
          <CardDescription>Summary for this account</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
      </Card>,
    )
    expect(screen.getByRole('heading', { name: 'Customer overview' })).toBeInTheDocument()
    expect(screen.getByText('Summary for this account')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})
