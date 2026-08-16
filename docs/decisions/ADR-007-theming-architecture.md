# ADR-007: Theming architecture (light/dark)

**Status:** Accepted

## Context

Phase 2 required light and dark themes where "components do not need separate hardcoded
light/dark styles" and "theme switching should be centralized" (project brief). Needed an
approach that works with Tailwind v4's CSS-first configuration (no `tailwind.config.js`
`darkMode` option — v4 removed the JS config in favor of `@theme` in CSS).

## Decision

**CSS custom properties, not JS theme objects, are the source of truth.** Every semantic token
(`--background`, `--foreground`, `--primary`, ...) is defined once per theme in `src/index.css`
(`:root` for light, `.dark` for dark) with identical variable _names_ and different _values_.
`@theme inline` maps these into Tailwind's namespaces (`--color-background`, etc.) so utilities
like `bg-background` resolve against whichever theme is currently active — no component ever
branches on `theme === 'dark'`.

**Class-based switching**, not `prefers-color-scheme` alone: `design-system/themes/theme.ts`
toggles a `.dark` class on `<html>`, matching the CSS above. The user's OS preference is only
the _default_ (via `getSystemTheme()`) — an explicit in-app choice, persisted to
`localStorage`, always wins on subsequent visits.

**`design-system/themes/` owns the `ThemeProvider`/`useTheme`, not `app/`.** This was a
deliberate fix to an architecture conflict: `components/ui/ThemeToggle` needs `useTheme`, but
`components/` may depend on `design-system/` while never on `app/` (see
docs/architecture/dependency-rules.md). Placing theming in `design-system/` — which the folder
structure already reserved a `themes/` subfolder for — resolves this without weakening the
dependency graph. `app/providers/AppProviders` mounts the provider once, same as any other
global provider.

**A pre-hydration inline script in `index.html`** duplicates `getInitialTheme()`'s logic to set
the `.dark` class before React loads, preventing a flash of the wrong theme. It's intentionally
NOT imported from `theme.ts` (inline scripts run before any module graph is available) — kept in
sync by hand, called out in both places' comments.

**`@custom-variant dark (&:where(.dark, .dark *));`** was added to `src/index.css` after a real
bug: Tailwind v4's built-in `dark:` variant defaults to `@media (prefers-color-scheme: dark)`,
completely ignoring our `.dark` class unless this override is present. `app/layouts/RootLayout`
originally used raw `bg-white dark:bg-slate-950` (a Phase 1 placeholder) — in dark mode, the
`dark:` utility silently never activated, and the opaque `bg-white` masked the (correctly dark)
`<body>` background beneath it, page-wide. Caught by comparing `getComputedStyle` (correct)
against actual rendered screenshots (wrong) — see the verification method in
docs/architecture/dependency-rules.md for why this project checks lint/config claims empirically
rather than trusting them. Fixed by (a) switching `RootLayout` to semantic tokens, which sidestep
`dark:` entirely, and (b) adding the custom variant so any future accidental `dark:` usage still
works correctly instead of failing the same way again.

## Consequences

- Adding a new semantic token requires touching exactly one file (`src/index.css`) in two
  places (`:root` and `.dark`) — no JS theme object to keep in sync.
- Prefer semantic tokens over raw Tailwind colors/`dark:` variants in all new code — see
  CLAUDE.md's design-system rules. `dark:` utilities remain functional (via the custom variant)
  as a fallback, not the primary pattern.
- Contrast for every token pair is enforced by `tests/unit/design-system-tokens.test.ts`, which
  parses `src/index.css` directly — see docs/design-system/tokens.md.
