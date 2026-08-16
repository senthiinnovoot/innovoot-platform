# components/ui

Primitive UI components — the base layer. No business logic, no data fetching, no knowledge of
any module.

**Status:** Phase 2 + Phase 3A — `Button`, `Input`, `Card` (+ slots), `Badge`, `Text`,
`ThemeToggle`, `Select`, `Checkbox`, `RadioGroup`, `Textarea`, `Switch`, `Avatar`.

## Rule

Everything here must be reusable across unrelated modules with no import from `modules/`. If a
component needs to know about customers, orders, or any other business domain, it belongs in that
module's `components/` folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing modules for something close
enough to extend — see the reusability rules in `CLAUDE.md`.

## Native controls over custom widgets

`Select`, `Checkbox`, `RadioGroup`, `Textarea` wrap native HTML form controls rather than
reimplementing them as custom listboxes/comboboxes — the browser already provides correct
keyboard and screen-reader behavior for these. `Switch` is the one exception: no native
`<input type="switch">` exists, so it's built on `role="switch"` on a real `<button>`.

`Switch` has no visible label slot, so its `label` prop is **required**, not optional — a
`Switch` must never render without an accessible name. Pass a short, specific description of what
the switch controls (e.g. `label="Enable notifications"`), not a generic string.

## Self-labelling vs. `components/forms/FormField`

`Input`, `Select`, `Checkbox`, `RadioGroup`, and `Textarea` each accept their own
`label`/`hint`/`error` props and manage their own id/ARIA wiring — use this directly for the
common case. Reach for `components/forms/FormField` instead when composing a control that doesn't
self-label, or when a field's layout needs to stay consistent regardless of which control it
wraps. Don't mix both accessibility systems on the same control (e.g. don't wrap an `Input` that
already has a `label` prop in a `FormField` that also renders a label).
