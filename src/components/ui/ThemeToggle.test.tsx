import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { ThemeProvider } from '@design-system/themes/theme-provider'

import { ThemeToggle } from './ThemeToggle'

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
  })

  it('has an accessible name describing the action it performs', () => {
    renderWithTheme()
    // Either label is acceptable depending on the resolved initial theme —
    // the point is it's a real, specific accessible name, not "button".
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-label')).toMatch(/switch to (light|dark) theme/i)
  })

  it('toggles the `dark` class on <html> when activated', async () => {
    const user = userEvent.setup()
    renderWithTheme()
    const wasDark = document.documentElement.classList.contains('dark')
    await user.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('dark')).toBe(!wasDark)
  })
})
