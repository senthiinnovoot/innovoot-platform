/**
 * Theme logic — framework-agnostic (no React). `design-system/themes/theme-provider.tsx`
 * wraps this in a React context; keep this file free of React so it stays
 * usable from anywhere (including the pre-hydration inline script in
 * `index.html` that prevents a flash of the wrong theme).
 */

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

export const THEME_STORAGE_KEY = 'innovoot-theme'
export const DARK_CLASS = 'dark'

/** The user's OS/browser-level color scheme preference. */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Reads the persisted preference, if any (`'system'` is not persisted explicitly). */
export function getStoredPreference(): ThemePreference | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

/** Resolves a preference (`'system'` or explicit) down to an actual applied theme. */
export function resolveTheme(preference: ThemePreference): Theme {
  return preference === 'system' ? getSystemTheme() : preference
}

/** Applies a resolved theme to the document root by toggling the `.dark` class. */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle(DARK_CLASS, theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

/** Persists an explicit (non-`'system'`) preference. */
export function storePreference(theme: Theme): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Computes the theme to apply on first load: stored preference if the user
 * has explicitly chosen one, otherwise the OS preference. Used by both the
 * React provider and the pre-hydration inline script in `index.html` — the
 * two must agree, or the page flashes the wrong theme on load.
 */
export function getInitialTheme(): Theme {
  return resolveTheme(getStoredPreference() ?? 'system')
}
