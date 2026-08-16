# ADR-006: Enforce module boundaries via ESLint, not just documentation

**Status:** Accepted

## Context

The module-first architecture ([ADR-001](./ADR-001-module-first-architecture.md)) only holds up
if the dependency rules are actually followed. Documentation alone (a `docs/` page saying "don't
import another module's internals") tends to erode under deadline pressure, especially across
many contributors or AI-assisted changes, unless something outside code review catches
violations automatically.

## Decision

Add `eslint-plugin-boundaries` to `eslint.config.js`, configured to enforce:

1. The layer dependency graph (`app → modules/components/shared/design-system/infrastructure`,
   etc.) via `boundaries/dependencies`.
2. That cross-module imports can only reach a module's `index.ts`, never internal files, via
   `boundaries/entry-point`.

See [dependency-rules.md](../architecture/dependency-rules.md) for the full enforced graph and
important notes on this plugin version's configuration quirks (some valid-looking config
combinations silently no-op instead of erroring, verified empirically during setup).

## Alternatives considered

- **Documentation only:** rejected as insufficient per the Context above.
- **Custom ESLint rule:** more control, but meaningfully more code to write and maintain for a
  Phase-1 foundation; `eslint-plugin-boundaries` covers the exact use case out of the box.
- **A monorepo tool (Nx, Turborepo) with enforced package boundaries:** would give stronger
  enforcement (real package boundaries, not just lint rules) but is a significantly heavier
  structural commitment (real package.json per module, build orchestration) that isn't justified
  at this stage for what is currently a single deployable app. Revisit if/when modules need to
  be independently versioned, deployed, or owned by separate teams.

## Consequences

- `pnpm lint` is now load-bearing for architecture, not just code style — a broken boundary is a
  CI-failing error, not a warning.
- Contributors (human or AI) get fast, local feedback when accidentally reaching into another
  module's internals, rather than that surfacing only in code review or, worse, not at all.
- This rule set needs to be kept in sync with `dependency-rules.md` by hand — there's no single
  source of truth generating both. If they drift, trust the ESLint config (what's actually
  enforced) and fix the doc.
