# ADR-001: Module-first architecture

**Status:** Accepted

## Context

Innovoot will eventually cover a dozen-plus business domains (customers, leads, appointments,
orders, payments, marketing, ...). A conventional SPA layout that groups files by technical type
(`pages/`, `components/`, `services/` at the top level) tends to become unmaintainable at this
scale: unrelated domains' files interleave, it's unclear what's safe to change, and there's no
mechanism to prevent accidental coupling between domains.

## Decision

Organize business functionality by domain under `src/modules/<name>/`, each with a consistent
internal structure and a single public entry point (`index.ts`). Generic, domain-agnostic code
lives in `components/`, `shared/`, and `design-system/`. See
[docs/architecture/overview.md](../architecture/overview.md) and
[module-architecture.md](../architecture/module-architecture.md).

## Consequences

- Cross-module coupling is visible and reviewable (an import from another module's internals is
  a lint error, not just a convention — see [ADR-006](./ADR-006-module-boundary-enforcement.md)).
- Slightly more upfront ceremony per module (an `index.ts`, a decision about what's public) than
  a flat structure — accepted as worthwhile given the number of planned domains.
- New modules have an unambiguous place to start (see the "Adding a new module" checklist in
  module-architecture.md), which matters for both human and AI-assisted development.
