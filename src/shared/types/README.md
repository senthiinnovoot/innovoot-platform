# shared/types

Cross-module TypeScript types/interfaces (e.g. Pagination<T>, ApiError). Module-specific types stay in modules/*/types.

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
