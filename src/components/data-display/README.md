# components/data-display

Generic data-presentation primitives — `StatusBadge`, `KeyValue`, `DefinitionList`, `Timeline`.

**Status:** Phase 3B — `StatusBadge`, `KeyValue`, `DefinitionList`, `Timeline`. (`StatCard`/
`ActionCard`-style summary cards live in `components/cards/`, not here — see Phase 3C.)

## Rule

Everything here must be reusable across unrelated modules with no import
from `modules/`. If a component needs to know about customers, orders, or
any other business domain, it belongs in that module's `components/`
folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing
modules for something close enough to extend — see the reusability rules
in `CLAUDE.md`.

## `KeyValue` vs. `DefinitionList`

Independent components, not one built on the other. `KeyValue` is a single, purely visual
label/value pair for standalone use. `DefinitionList` is a real semantic `<dl>`/`<dt>`/`<dd>` list
for displaying several pairs together — `<dt>`/`<dd>` outside a `<dl>` would be invalid HTML, so
`KeyValue` intentionally doesn't reuse that markup.

## `StatusBadge`

A fixed, generic five-tone vocabulary (`success` | `warning` | `error` | `info` | `neutral`) —
not business-specific statuses. The display text is always the caller's own words via `children`:

```tsx
<StatusBadge status="success">Active</StatusBadge>
```
