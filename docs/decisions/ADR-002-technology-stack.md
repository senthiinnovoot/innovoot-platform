# ADR-002: Technology stack

**Status:** Accepted

## Context

Starting from an empty repository, a framework, language, and toolchain had to be chosen before
any structure could be built. Decided in conversation with the project owner (see the framework,
backend-scope, styling, and package-manager questions posed at the start of Phase 1).

## Decision

| Concern          | Choice                                | Alternatives considered                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | React 19 + Vite (SPA)                 | **Next.js (App Router)** — recommended initially for its built-in SSR/SEO given the planned `seo` module, but not chosen; see [ADR-005](./ADR-005-spa-seo-tradeoff.md) for the resulting tradeoff. Vue/Angular/SvelteKit were not evaluated in depth given no stated preference for them. |
| Language         | TypeScript, strict mode               | Plain JS rejected — explicit types are load-bearing for the module `index.ts` public-API contract and for AI-assisted development (project brief §15).                                                                                                                                    |
| Styling          | Tailwind CSS v4                       | CSS Modules and CSS-in-JS (styled-components/vanilla-extract) considered; Tailwind chosen for its natural fit with a token-based design system and large ecosystem.                                                                                                                       |
| Routing          | React Router 7                        | Required once Next.js was ruled out; the standard choice for React SPA routing.                                                                                                                                                                                                           |
| Server-state     | TanStack Query                        | Considered plain fetch + custom hooks; rejected as reinventing caching/retry/loading-state handling that TanStack Query already solves well.                                                                                                                                              |
| Client-state     | Zustand                               | Considered Redux Toolkit (heavier, more boilerplate than needed at this stage) and plain React Context (insufficient for cross-module state like auth session without prop-drilling or re-render cost).                                                                                   |
| Forms/validation | react-hook-form + zod                 | Considered Formik (less actively maintained) and manual form state (too much repeated boilerplate across ~12 modules' worth of forms).                                                                                                                                                    |
| Testing          | Vitest + Testing Library + Playwright | Standard pairing for Vite projects; avoids Jest's slower/more complex Vite integration.                                                                                                                                                                                                   |
| Package manager  | pnpm                                  | Chosen over npm for stricter dependency resolution and disk efficiency, at the cost of a marginally less universal toolchain than npm.                                                                                                                                                    |

## Consequences

- No backend/SSR out of the box — see [ADR-004](./ADR-004-frontend-only-scope.md).
- The `seo` module's real capabilities are constrained by the SPA choice — see
  [ADR-005](./ADR-005-spa-seo-tradeoff.md). This is the one decision in this ADR the project
  owner should revisit if public-facing SEO becomes a near-term priority, since migrating a
  meaningfully-sized SPA to a meta-framework later is significantly more expensive than choosing
  correctly up front.
- All dependencies added here are documented with rationale, per the "no new dependency without
  explanation" rule in `CLAUDE.md` §14.
