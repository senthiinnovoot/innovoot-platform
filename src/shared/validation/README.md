# shared/validation

Shared zod schema building blocks (email, phone, currency, pagination params) that module validation/ schemas compose.

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
