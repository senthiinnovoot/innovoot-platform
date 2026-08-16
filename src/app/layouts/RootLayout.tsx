import { Outlet } from 'react-router-dom'

/**
 * Application shell. Owns global chrome (nav, sidebar, footer) once those
 * exist — module pages render into <Outlet /> and must not re-implement
 * page chrome themselves.
 *
 * Uses semantic tokens (`bg-background`/`text-foreground`), not raw
 * `bg-white`/`dark:bg-slate-950` — see docs/design-system/tokens.md. This
 * also matters mechanically, not just stylistically: Tailwind's built-in
 * `dark:` variant tracks OS `prefers-color-scheme` unless a
 * `@custom-variant dark` override is configured (see src/index.css), so
 * `dark:*` utilities silently ignore our `.dark` class toggle — semantic
 * tokens sidestep that entirely by resolving through CSS variables instead.
 */
export function RootLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      <Outlet />
    </div>
  )
}
