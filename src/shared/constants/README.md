# shared/constants

App-wide constants that are not environment/config (see app/config) — enums, route path segments, shared magic strings.

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
