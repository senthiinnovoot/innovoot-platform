# shared/utils

Pure, framework-agnostic utility functions (formatting, date helpers, string/number utils). No React, no side effects.

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
