# shared/hooks

Cross-module, domain-agnostic React hooks (useDebounce, useLocalStorage-style patterns without localStorage per artifact rules, useMediaQuery, usePagination).

**Status:** not yet built (foundation stage only).

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.
