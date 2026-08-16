import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DefinitionList } from './DefinitionList'

const items = [
  { label: 'Email', value: 'jane@example.com' },
  { label: 'Phone', value: '555-0100' },
]

describe('DefinitionList', () => {
  it('renders a real <dl>', () => {
    const { container } = render(<DefinitionList items={items} />)
    expect(container.querySelector('dl')).toBeInTheDocument()
  })

  it('renders each item as a dt/dd pair', () => {
    const { container } = render(<DefinitionList items={items} />)
    const terms = container.querySelectorAll('dt')
    const definitions = container.querySelectorAll('dd')
    expect(terms).toHaveLength(2)
    expect(definitions).toHaveLength(2)
    expect(terms[0]).toHaveTextContent('Email')
    expect(definitions[0]).toHaveTextContent('jane@example.com')
  })

  it('renders all provided labels and values', () => {
    render(<DefinitionList items={items} />)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('555-0100')).toBeInTheDocument()
  })

  it('renders an empty list without error when given no items', () => {
    const { container } = render(<DefinitionList items={[]} />)
    expect(container.querySelector('dl')).toBeInTheDocument()
    expect(container.querySelectorAll('dt')).toHaveLength(0)
  })
})
