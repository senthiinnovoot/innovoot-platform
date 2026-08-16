import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders normally with the default accessible message', () => {
    render(<LoadingState />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('uses a custom label as the accessible loading message', () => {
    render(<LoadingState label="Loading customers…" />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading customers…')
    expect(screen.getByText('Loading customers…')).toBeInTheDocument()
  })

  it('renders the spinner as decorative, not exposed as a separate accessible element', () => {
    const { container } = render(<LoadingState label="Loading…" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    // no separate role="img" for the spinner — the label text is the only
    // accessible content a screen reader should encounter
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applies the spin animation class, relying on the global reduced-motion override rather than a second motion system', () => {
    const { container } = render(<LoadingState />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })

  it('respects prefers-reduced-motion via the global CSS override (no component-level branching)', () => {
    // The project neutralizes motion globally in src/index.css via
    // `@media (prefers-reduced-motion: reduce)`, not per-component JS —
    // confirm LoadingState doesn't reimplement its own motion-detection
    // logic (no `matchMedia` usage) and always renders the same
    // `animate-spin` class regardless of the media query result.
    const matchMediaSpy = vi.fn()
    vi.stubGlobal('matchMedia', matchMediaSpy)
    const { container } = render(<LoadingState />)
    expect(matchMediaSpy).not.toHaveBeenCalled()
    expect(container.querySelector('svg')).toHaveClass('animate-spin')
  })
})
