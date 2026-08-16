# design-system/themes

Light/dark theme definitions and any future brand theme variants, expressed as token overrides.

**Status:** not yet built — this is a placeholder for the "Design System"
pipeline stage. See docs/design-system/tokens.md for the agreed strategy.

## Rule

`design-system/` is the lowest layer in the dependency graph — it must
not import from `shared/`, `components/`, `modules/`, or `app/`.
Never hardcode raw hex colors, pixel spacing, or shadow values in
components; consume tokens defined here instead.
