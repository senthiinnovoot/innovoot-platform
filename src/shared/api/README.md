# shared/api

The single, shared HTTP/data-access layer — a typed fetch/query client wrapper that every module's services/ build on. No module should call fetch() or construct request URLs directly.

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
