# design-system/documentation

Human-readable design system reference docs / examples (a lightweight in-repo alternative to a full Storybook, unless Storybook is adopted later).

**Status:** not yet built — this is a placeholder for the "Design System"
pipeline stage. See docs/design-system/tokens.md for the agreed strategy.

## Rule

`design-system/` is the lowest layer in the dependency graph — it must
not import from `shared/`, `components/`, `modules/`, or `app/`.
Never hardcode raw hex colors, pixel spacing, or shadow values in
components; consume tokens defined here instead.
