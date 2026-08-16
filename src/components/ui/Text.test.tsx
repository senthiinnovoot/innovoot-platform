import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Text } from './Text'

describe('Text', () => {
  it('defaults to a paragraph for body variants', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello').tagName).toBe('P')
  })

  it('renders the semantically-correct default heading level for a heading variant', () => {
    render(<Text variant="heading-xl">Section title</Text>)
    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeInTheDocument()
  })

  it('allows overriding the rendered element independently of the visual variant', () => {
    render(
      <Text variant="heading-sm" as="h1">
        Page title
      </Text>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Page title' })).toBeInTheDocument()
  })
})
