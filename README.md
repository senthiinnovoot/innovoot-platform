# Innovoot

A module-first React SPA. **Start with `CLAUDE.md`** for the project's permanent development
rules, and `docs/architecture/overview.md` for the why behind the structure.

> **Status:** foundation stage. No business modules or design-system tokens exist yet — see
> `docs/architecture/overview.md#what-phase-1-deliberately-does-not-include`.

## Stack

React 19 + Vite (TypeScript, strict) · React Router · TanStack Query · Zustand ·
react-hook-form + zod · Tailwind CSS v4 · Vitest + Testing Library · Playwright · ESLint + Prettier
· pnpm

Full rationale: `docs/decisions/ADR-002-technology-stack.md`.

## Getting started

```bash
pnpm install
pnpm dev          # start the dev server
```

## Scripts

| Command                                                | What it does                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `pnpm dev`                                             | Start the Vite dev server                                                       |
| `pnpm build`                                           | Typecheck + production build                                                    |
| `pnpm preview`                                         | Preview the production build locally                                            |
| `pnpm typecheck`                                       | `tsc` project-references check, no emit                                         |
| `pnpm lint` / `pnpm lint:fix`                          | ESLint, including a11y and module-boundary rules                                |
| `pnpm format` / `pnpm format:check`                    | Prettier                                                                        |
| `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` | Vitest (unit + integration)                                                     |
| `pnpm test:e2e`                                        | Playwright end-to-end tests                                                     |
| `pnpm verify`                                          | typecheck + lint + format check + unit tests — run before considering work done |

## Project structure

See `docs/architecture/folder-structure.md` for the full annotated tree. In short:

```text
src/
├── app/             composition root — routes, layouts, providers, config
├── modules/         business domains (customers, leads, orders, ...)
├── components/      generic, reusable UI
├── shared/          generic, reusable logic
├── design-system/   tokens, theming (strategy defined, not yet implemented)
└── infrastructure/  backend/vendor integration points (currently stubs)
```

## Architecture docs

- `docs/architecture/overview.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/module-architecture.md`
- `docs/architecture/dependency-rules.md` — the enforced module-boundary rules
- `docs/design-system/tokens.md`
- `docs/decisions/` — ADRs for every significant architectural decision
