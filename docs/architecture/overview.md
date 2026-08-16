# Architecture Overview

Innovoot is a module-first, frontend-only (Phase 1) single-page application. Business
functionality is organized by domain (customers, leads, appointments, orders, ...) rather than
by technical layer, so that each business area can be developed, reasoned about, and eventually
owned independently, while still sharing a common design system and generic component library.

## Why module-first

A conventional SPA that groups files by type (`pages/`, `components/`, `services/`) scales
poorly once a product covers a dozen-plus business domains: unrelated features end up tangled
together, and it becomes hard to tell what's safe to change without reading the whole codebase.
Grouping by domain instead means a change to `orders` cannot silently break `customers`, because
the dependency direction between modules is defined and enforced (see
[dependency-rules.md](./dependency-rules.md)).

This also matters for AI-assisted development (see `CLAUDE.md` §15): a predictable module
structure lets an agent (human or AI) reason about one module's `index.ts` public surface without
needing to read its internals, and without needing to read unrelated modules at all.

## Layers

```text
app/              → composition root: routes, layouts, providers, config
modules/          → business domains (customers, leads, orders, ...)
components/       → generic, reusable UI — no business knowledge
shared/           → generic, reusable logic — no business knowledge
design-system/    → design tokens, theming, typography, icons — the foundation layer
infrastructure/   → integration points for backend services (currently stubbed)
```

Each layer only depends on the layers below it — see
[dependency-rules.md](./dependency-rules.md) for the enforced graph.

## Technology stack

| Concern         | Choice                                                        | Why                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | React 19 + Vite                                               | Chosen over Next.js for this phase (frontend-only, no SSR requirement yet). See [ADR-002](../decisions/ADR-002-technology-stack.md) and the SEO tradeoff in [ADR-005](../decisions/ADR-005-spa-seo-tradeoff.md). |
| Language        | TypeScript (strict)                                           | Explicit types are load-bearing for AI-assisted development (§15) and for the module public-API contract enforced via `index.ts`.                                                                                |
| Routing         | React Router 7                                                | De facto standard for React SPAs; modules register their own routes.                                                                                                                                             |
| Server-state    | TanStack Query                                                | Caching/loading/error state for data modules will fetch from `shared/api` once a backend exists.                                                                                                                 |
| Client-state    | Zustand                                                       | Minimal boilerplate for cross-module UI/session state (e.g. auth session) where React context isn't enough.                                                                                                      |
| Forms           | react-hook-form + zod                                         | zod schemas double as the runtime validation layer described in `modules/*/validation` and `shared/validation`.                                                                                                  |
| Styling         | Tailwind CSS v4                                               | Utility-first, pairs naturally with a token-based design system (`@theme` tokens land in Phase "Design System").                                                                                                 |
| Testing         | Vitest + Testing Library (unit/integration), Playwright (e2e) | Standard, fast, first-class Vite integration.                                                                                                                                                                    |
| Lint/format     | ESLint (flat config) + Prettier                               | ESLint additionally enforces the module dependency graph via `eslint-plugin-boundaries` — see [dependency-rules.md](./dependency-rules.md).                                                                      |
| Package manager | pnpm                                                          | Disk-efficient, strict dependency resolution.                                                                                                                                                                    |

See [ADR-002](../decisions/ADR-002-technology-stack.md) for the full rationale and alternatives
considered.

## What Phase 1 deliberately does not include

- No backend, database, or real authentication — `infrastructure/` holds stub folders with
  documented integration points, not implementations (see
  [ADR-004](../decisions/ADR-004-frontend-only-scope.md)).
- No business modules — `modules/*` contain only `README.md` placeholders describing intent.
- No design tokens beyond Tailwind's defaults — token strategy is documented in
  [docs/design-system/tokens.md](../design-system/tokens.md) but not yet implemented.
- No primitive/composite components — `components/*` contain only `README.md` placeholders.

These are intentionally deferred to later pipeline stages (Design System → Shared Components →
Module Foundation → First Business Module) per `CLAUDE.md` §1.

## Phase 2 status: Design System

Phase 2 implemented the design-token and theming foundation the point above describes as
deferred. As of Phase 2:

- Design tokens (color, typography, spacing, radius, shadow, z-index, motion) are implemented as
  CSS custom properties + Tailwind v4 `@theme inline` in `src/index.css` — see
  [docs/design-system/tokens.md](../design-system/tokens.md) for the full, current token set.
- Light and dark themes exist, centrally switched via a `.dark` class and
  `design-system/themes/theme-provider.tsx` — see
  [ADR-007](../decisions/ADR-007-theming-architecture.md).
- A small foundational component set exists in `components/ui/` (`Button`, `Text`, `Input`,
  `Card`, `Badge`, `ThemeToggle`) — enough to validate the design system, not a full library. See
  [ADR-008](../decisions/ADR-008-component-variant-strategy.md) for the variant-API approach. The
  full composite/business component layers (`components/{forms,tables,...}`) are still deferred
  to later stages, as is business-module work — `modules/*` remains `README.md`-only.
- A dev-only showcase route (`/design-system`, excluded from production builds) demonstrates every
  token category and component for visual/manual validation — not a product page.

Automated arbitrary-Tailwind-value linting remains deferred — see
[ADR-009](../decisions/ADR-009-deferred-arbitrary-value-lint.md).
