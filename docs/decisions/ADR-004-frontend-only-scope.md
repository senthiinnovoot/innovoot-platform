# ADR-004: Frontend-only scope for Phase 1

**Status:** Accepted — revisit when backend work begins

## Context

At project start, no backend, database, or hosting decision had been made. Building against a
speculative backend design risks getting the `infrastructure/` and `shared/api` contracts wrong
and having to rework them once real backend requirements are known.

## Decision

Build the frontend architecture against well-defined interfaces rather than a concrete backend.
`infrastructure/{database,authentication,storage,logging,monitoring}/` exist as stub folders with
`README.md`s documenting their intended integration point, but contain no implementation. Modules
and `shared/api` should be written to depend on an interface here, not on a specific vendor SDK,
so that wiring in a real backend later is a matter of implementing that interface rather than
rewriting module code.

## Consequences

- No real data persists yet — anything built in the next stages (Design System, Shared
  Components, Module Foundation) will necessarily use mock/local data until this is revisited.
- Auth (`modules/auth`) can be scaffolded UI-first but cannot be functionally complete until an
  identity provider is chosen and `infrastructure/authentication/` is implemented.
- This ADR should be revisited — not silently expanded — once backend requirements are known.
  Update this file's status rather than starting backend work without a documented decision.
