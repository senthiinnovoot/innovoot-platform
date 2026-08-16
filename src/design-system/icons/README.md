# design-system/icons

A thin, curated wrapper around `lucide-react` so components import an `Icon` from one place,
not the icon library directly.

**Status:** Phase 3A — `Icon` component with a curated `IconName` union (`chevron-down`, `sun`,
`moon`, `user`). Add an icon by importing it and adding one entry to the map in `Icon.tsx` — do
not import the whole `lucide-react` package or import icons directly elsewhere.

## Rule

`design-system/` is the lowest layer in the dependency graph — it must not import from `shared/`,
`components/`, `modules/`, or `app/` (see docs/architecture/dependency-rules.md). `Icon.tsx` uses
`clsx`/`tailwind-merge` directly rather than `shared/utils/cn` for this reason.

Never hardcode raw hex colors, pixel spacing, or shadow values in components; consume tokens
defined here instead.

## Accessibility

Icons are decorative (`aria-hidden`) by default, since most usages accompany visible text or an
already-labelled control. Pass `label` to promote an icon to a meaningful, standalone image
(`role="img"` + `aria-label`).
