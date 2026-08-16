import { Icon } from '@design-system/icons'
import { useTheme } from '@design-system/themes/theme-provider'

import { Button } from './Button'

/**
 * The one foundational component that's intentionally NOT purely
 * presentational — it reads `useTheme` from `design-system/themes`
 * directly, since theming is itself a design-system concern (not a
 * business one). See docs/architecture/dependency-rules.md: this is why
 * `useTheme` lives in `design-system/`, not `app/` — `components/` may
 * depend on `design-system/`, but never on `app/`.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      <Icon
        name={isDark ? 'sun' : 'moon'}
        className="motion-safe:transition-transform motion-safe:duration-200"
      />
    </Button>
  )
}
