import { createContext, type ReactNode, use, useCallback, useEffect, useState } from 'react'

import { applyTheme, getInitialTheme, storePreference, type Theme } from './theme'

interface ThemeContextValue {
  /** The currently applied theme — always resolved, never `'system'`. */
  theme: Theme
  /** Explicitly set and persist a theme. */
  setTheme: (theme: Theme) => void
  /** Convenience toggle between light and dark. */
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Centralizes theme state. Mounted once in `app/providers/AppProviders`.
 * Lives in `design-system/` (not `app/`) so that `components/*` — which
 * may depend on `design-system/` but not on `app/` — can consume
 * `useTheme` too (see docs/architecture/dependency-rules.md). The initial
 * value matches the inline script in `index.html`, which sets the `.dark`
 * class before React hydrates to avoid a flash of the wrong theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    storePreference(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      storePreference(next)
      return next
    })
  }, [])

  return <ThemeContext value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const ctx = use(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within <ThemeProvider>')
  }
  return ctx
}
