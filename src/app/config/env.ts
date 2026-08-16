/**
 * Centralized environment/config access.
 *
 * Never read `import.meta.env.*` directly from modules, components, or
 * shared code — always go through this file. That keeps every environment
 * variable declared, typed, and validated in exactly one place, and means
 * renaming or adding a variable only touches this file.
 */

interface AppEnv {
  /** Human-readable app name, used in <title>, emails, etc. */
  appName: string
  /** Current Vite mode: 'development' | 'production' | 'test' | custom. */
  mode: string
  /** Base URL the app is served from (Vite's BASE_URL). */
  baseUrl: string
}

export const env: AppEnv = {
  appName: 'Innovoot',
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
}
