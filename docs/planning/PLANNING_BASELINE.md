# Innovoot — Planning Baseline

This document summarizes the current state of the `innovoot-platform` repository for use by the
Innovoot Product Planning Claude Project. It contains only information confirmed by the
repository's code and documentation at the time of writing (branch `phase-3/reusable-components`).
It does not describe product requirements, does not treat proof-of-concept code as final scope,
and does not add recommendations.

## 1. Purpose of the New Base Kit

This repository is a frontend-only foundation for Innovoot, built in documented phases:

- **Phase 1** — project scaffolding, module-first architecture, folder structure, dependency
  rules (no business modules, no design tokens).
- **Phase 2** — design tokens and theming, a small foundational primitive component set.
- **Phase 3A / 3B** — a reusable UI component library (primitives, forms, feedback, data-display).
- **Phase 4** — a generic mock/real API abstraction (`shared/api`) and one proof-of-concept data
  module (`customers`).
- **Phase 4A** — a `business-context` module (Tenant/Business/BusinessType/Branch/enabled
  Modules) and a module-aware application shell (Sidebar, TopBar, routing, a Hospital dashboard).

No real backend integration, authentication, or business-module UI (Patients, Appointments,
Pharmacy, Lab, Rooms, or any other) has been implemented. `docs/decisions/ADR-004-frontend-only-scope.md`
records this as a deliberate, revisit-later decision.

## 2. Confirmed Technology Stack

Per `package.json`, `README.md`, and `docs/decisions/ADR-002-technology-stack.md`:

| Concern                 | Choice                                                                            |
| ----------------------- | --------------------------------------------------------------------------------- |
| Framework               | React 19 (`^19.2.8`) + Vite (`^8.2.0`), TypeScript strict (`~6.0.2`)              |
| Routing                 | React Router (`react-router-dom` `^7.18.2`)                                       |
| Server state            | TanStack Query (`@tanstack/react-query` `^5.101.4`)                               |
| Client state            | Zustand (`^5.0.15`)                                                               |
| Forms/validation        | react-hook-form (`^7.85.0`) + zod (`^4.4.3`)                                      |
| Styling                 | Tailwind CSS v4 (`^4.3.3`)                                                        |
| Variant/class utilities | class-variance-authority, clsx, tailwind-merge                                    |
| Icons                   | lucide-react, wrapped by a curated `design-system/icons` module                   |
| Testing                 | Vitest + Testing Library (unit/integration), Playwright (`@playwright/test`, e2e) |
| Lint/format             | ESLint (flat config, `eslint-plugin-boundaries` for module boundaries) + Prettier |
| Package manager         | pnpm, pinned via `"packageManager": "pnpm@10.34.5"` in `package.json`             |
| Node version            | pinned via `.nvmrc` to `24`                                                       |

**Backend (confirmed as external context, not implemented in this repository):** Express +
TypeScript + MySQL, per direct statements from the backend developer during planning. No backend
code, API endpoints, or database connection exist in this repository.

## 3. Application Architecture

Per `docs/architecture/overview.md` and `docs/architecture/dependency-rules.md`, six layers, each
only permitted to depend on the layers below it, enforced by `eslint-plugin-boundaries`:

```text
app/              composition root — routes, layouts, providers, config
modules/          business domains
components/       generic, reusable UI — no business knowledge
shared/           generic, reusable logic — no business knowledge
design-system/    tokens, theming, icons — the foundation layer
infrastructure/   backend/vendor integration points — currently stubs
```

Disallowed directions (enforced, not just documented): `components/` and `shared/` may not import
from `modules/` or `app/`; `design-system/` may not import from anything above it; nothing may
import from `app/`.

## 4. Module Architecture

Per `docs/architecture/module-architecture.md`, each module under `src/modules/<name>/` follows:

```text
modules/<name>/
├── components/    business-specific UI (not components/)
├── pages/         route-level page components
├── hooks/         module-scoped React hooks
├── services/      data access — built on shared/api, never fetch() directly
├── types/         module-scoped TypeScript types
├── validation/    zod schemas
└── index.ts       public API — the ONLY thing other modules may import
```

Not every subfolder is required per module. `index.ts` is the enforced public surface —
cross-module imports may only reach a module's `index.ts` (`boundaries/entry-point` ESLint rule).

**Modules currently present** (`src/modules/`): `appointments`, `auth`, `business-context`,
`customers`, `dashboard`, `leads`, `marketing`, `orders`, `payments`, `products`, `seo`,
`services`, `settings`.

- **`business-context`** — implemented: `types/`, `mock-data/`, `services/`, `hooks/`,
  `components/RequireModule.tsx`, `index.ts`.
- **`customers`** — implemented as a proof-of-concept for the mock API pattern only: `types/`,
  `mock-data/customers.json`, `services/`, `hooks/`, `index.ts`. Its `README.md` states it is not
  the final Innovoot customer schema.
- **`dashboard`** — implemented: `pages/DashboardPage.tsx`, `index.ts`.
- All other listed modules (`appointments`, `auth`, `leads`, `marketing`, `orders`, `payments`,
  `products`, `seo`, `services`, `settings`) contain only a `README.md` — no implementation.

## 5. Routing Architecture

Per `src/app/routes/router.tsx` (React Router 7, `createBrowserRouter`), route registration is
static (not generated from data). Confirmed current tree:

```text
/                                                     → FoundationStatusPage
/design-system                                        → DesignSystemShowcasePage (dev-only, excluded from production builds)
/b/:businessId/branch/:branchId                        → BusinessShellLayout
  ├── dashboard                                        → DashboardPage
  ├── patients      (behind RequireModule "patients")   → ModulePlaceholderPage
  ├── appointments  (behind RequireModule "appointments")→ ModulePlaceholderPage
  ├── pharmacy      (behind RequireModule "pharmacy")    → ModulePlaceholderPage
  ├── lab           (behind RequireModule "lab")         → ModulePlaceholderPage
  └── rooms         (behind RequireModule "rooms")       → ModulePlaceholderPage
```

`ModulePlaceholderPage` is a single generic component (reused across all five placeholder routes),
not a real page per module. `RequireModule` renders `<Navigate>` to the dashboard route when the
current business type's enabled modules do not include the requested module key.

## 6. Data Flow

Confirmed pattern, demonstrated by both `customers` and `business-context`:

```text
UI (hook consumer)
  → module hook (e.g. useCustomers, useBusinessContext)     — TanStack Query
  → module service (e.g. customersService, businessContextService)
  → shared/api ResourceClient<T>                             — generic contract
  → shared/api mock implementation (createMockResourceClient)
  → module's own mock-data/*.json
```

`shared/api/resource-client.ts`'s `createResourceClient()` is the single factory every module's
service calls; it currently always returns the mock implementation. No HTTP-backed implementation
exists yet. `docs/decisions/ADR-010-mock-real-api-abstraction-strategy.md` documents this and
states that only `resource-client.ts` would need to change to introduce a real implementation.

## 7. State Management

Per `docs/decisions/ADR-003-state-management.md`:

- **Server state:** TanStack Query, `QueryClient` configured once in
  `src/app/providers/AppProviders.tsx`.
- **Client state:** Zustand, reserved for state shared across modules or surviving route changes.
  Currently used in exactly one place: `components/feedback/useToast.ts` (the toast notification
  store). The `business-context` module's own `README.md` explicitly states it does not use
  Zustand — the URL (`businessId`/`branchId` route params) is the source of truth for the current
  business/branch, read via `useParams()`.
- **Forms:** react-hook-form + zod (per ADR-002/ADR-003); no form has been built yet that
  exercises this.

## 8. Business Context

Implemented in `src/modules/business-context/`. Confirmed types
(`types/business-context.ts`): `Tenant`, `BusinessCategory`, `Module`, `BusinessType` (holds a
resolved `modules: Module[]`), `Business`, `Branch`, `BusinessContext` (the bundle
`useBusinessContext()` returns).

Confirmed sample mock data (`mock-data/business-context.json`) — the only business
category/type/business/branch instance currently modeled:

```text
Tenant: "ABC Healthcare Group"
Business: "ABC City Hospital" (business type: Hospital)
Branch: "Main Branch"
Business Category: "Healthcare"
Business Type: "Hospital" — enabled modules: patients, appointments, pharmacy, lab, rooms
```

`useBusinessContext()` resolves this bundle via TanStack Query, keyed on the URL's
`businessId`/`branchId`. `useIsModuleEnabled(key)` is a derived boolean hook. No other business
category, business type, business, or branch exists in the codebase. The `Module` type includes an
`icon` field resolved in the service layer, not stored on the raw mock records.

## 9. Design System

Per `docs/design-system/tokens.md` and `docs/decisions/ADR-007-theming-architecture.md`:

- Design tokens (color, typography, spacing, radius, shadow, z-index, motion) are CSS custom
  properties defined once in `src/index.css`, mapped into Tailwind's theme via `@theme inline`.
- Light theme on `:root`, dark theme on a `.dark` class; `design-system/themes/theme-provider.tsx`
  and `theme.ts` own the toggle (persisted to `localStorage`, OS preference as default only).
  Components never branch on `theme === 'dark'`.
- `design-system/icons/Icon.tsx` is the only file permitted to import `lucide-react` directly; a
  curated `IconName` union currently includes: `bed`, `calendar`, `chevron-down`, `circle-alert`,
  `circle-check`, `flask-conical`, `info`, `layout-dashboard`, `loader-circle`, `moon`, `pill`,
  `sun`, `triangle-alert`, `user`, `users`, `x`.
- Component variants use `class-variance-authority` (`docs/decisions/ADR-008-component-variant-strategy.md`),
  applied to any component with 2+ visual variants; single-style components do not use it.
- Automated lint enforcement of "no arbitrary Tailwind values" is deliberately deferred
  (`docs/decisions/ADR-009-deferred-arbitrary-value-lint.md`); enforcement today is documentation
  and review.

## 10. Existing Components

Confirmed present under `src/components/`:

- **`ui/`** — `Avatar`, `Badge`, `Button`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/
  `CardContent`/`CardFooter`), `Checkbox`, `Input`, `RadioGroup`, `Select`, `Switch`, `Text`,
  `Textarea`, `ThemeToggle`.
- **`forms/`** — `FormField`, `FormActions`.
- **`feedback/`** — `Alert`, `EmptyState`, `ErrorState`, `LoadingState`, `Toast`, `Toaster`,
  `useToast`. `Toaster` exists but is not mounted in `app/providers/AppProviders.tsx` or anywhere
  else in the application.
- **`data-display/`** — `DefinitionList`, `KeyValue`, `StatusBadge`, `Timeline`.
- **`tables/`, `cards/`, `navigation/`** — folders exist with a `README.md` each; **no components
  are implemented in any of these three categories.**

The application shell's `Sidebar` and `TopBar` (`src/app/layouts/Sidebar.tsx`,
`src/app/layouts/TopBar.tsx`) are app-level composition built from the `ui/`/`feedback/`
components above — they are not generic components under `components/navigation/`.

## 11. API / Infrastructure

**Implemented** (`src/shared/api/`):

- `types.ts` — `ApiError` (an `Error` subclass with `status`/`code`), `QueryParams`, `PaginatedResponse<T>`, `ResourceClient<T>`.
- `resource-client.ts` — `createResourceClient()`, the single factory used by module services.
- `mock/create-mock-resource-client.ts` — a generic in-memory list/get/create/update/remove engine
  with configurable artificial latency (default 300ms), supporting pagination and single-field
  sorting. No free-text search, no random failure injection, no persistence beyond process
  lifetime (documented as deliberate in ADR-010).

**Stubbed, not implemented** (`src/infrastructure/`): `authentication/`, `database/`, `logging/`,
`monitoring/`, `storage/` — each contains only a `README.md` describing an intended integration
point. `docs/decisions/ADR-004-frontend-only-scope.md` records this as deliberate pending backend
requirements.

**Not implemented anywhere:** an HTTP-backed `ResourceClient` implementation, and any mechanism
for switching between the mock and a future real implementation. ADR-010 explicitly defers the
switching mechanism's design.

## 12. Testing / Quality

Per `package.json` scripts and `CLAUDE.md`:

- `pnpm typecheck` — `tsc -b --noEmit`.
- `pnpm lint` / `pnpm lint:fix` — ESLint, including `eslint-plugin-jsx-a11y` and
  `eslint-plugin-boundaries` (module-boundary enforcement).
- `pnpm format` / `pnpm format:check` — Prettier.
- `pnpm test` / `pnpm test:watch` / `pnpm test:coverage` — Vitest, unit and integration tests
  co-located with source files (`*.test.ts`/`*.test.tsx`).
- `pnpm test:e2e` — Playwright. Confirmed present: `tests/e2e/design-system.spec.ts`. No e2e test
  exists for any business flow (none is built yet).
- `tests/unit/design-system-tokens.test.ts` — parses `src/index.css` directly to verify contrast
  ratios for token pairs.
- `pnpm verify` — `typecheck && lint && format:check && test`, run before considering work done.
- `husky` + `lint-staged` run `eslint --fix` and `prettier --write` on staged files pre-commit.

## 13. Architectural Decisions

Summarized from `docs/decisions/`:

- **ADR-001** — Module-first architecture: business functionality organized under
  `modules/<name>/`, each with a single public `index.ts`.
- **ADR-002** — Technology stack selection (see §2), with alternatives considered.
- **ADR-003** — State management split: TanStack Query (server), Zustand (cross-module client,
  sparingly), react-hook-form + zod (forms).
- **ADR-004** — Frontend-only scope for Phase 1: `infrastructure/` are stub folders; revisit once
  backend requirements are known.
- **ADR-005** — SPA vs. SSR tradeoff for the (unbuilt) `seo` module: proceeding with a
  client-rendered SPA; explicitly flags that this should be revisited if public-facing SEO becomes
  a near-term priority, and notes the assumption that Innovoot may be a behind-login product is
  unconfirmed.
- **ADR-006** — Module boundaries enforced via `eslint-plugin-boundaries`, not documentation alone.
- **ADR-007** — Theming: CSS custom properties + class-based (`.dark`) switching, owned by
  `design-system/themes/`, not `app/`.
- **ADR-008** — Component variants via `class-variance-authority` for any component with 2+
  variants.
- **ADR-009** — Automated arbitrary-Tailwind-value lint enforcement deliberately deferred.
- **ADR-010** — Mock/real API abstraction: `shared/api`'s `ResourceClient<T>` is the single
  contract; only a mock implementation exists; the future HTTP implementation and the
  mock/real switching mechanism are explicitly deferred.

## 14. Explicit Constraints

The following are established by the repository and should not be casually changed without a new
ADR or equivalent documented decision:

- The six-layer dependency direction (§3), enforced by ESLint — not just a convention.
- A module's `index.ts` as its only public surface; no cross-module reach into internal files.
- `shared/api`'s `ResourceClient<T>` contract as the single data-access abstraction; module
  services must not call `fetch()` directly.
- Design tokens as the only source of color/spacing/typography/shadow values — no raw hex values
  or arbitrary Tailwind values without a documented reason.
- `design-system/icons/Icon.tsx` as the only file permitted to import `lucide-react` directly.
- The `business-context` module's URL-is-source-of-truth rule for current business/branch.
- `infrastructure/` remaining stubbed until backend requirements are known (ADR-004).
- `modules/customers` is documented as a proof-of-concept for the mock API pattern, not a
  reference for final product scope.

## 15. Known Gaps

Things this base kit does not yet establish:

- No real HTTP API client, no backend connection, no database.
- No authentication implementation (`infrastructure/authentication/` is a stub; `modules/auth`
  has no implementation).
- No components exist in `components/tables/`, `components/cards/`, or `components/navigation/`.
- No business module (Patients, Appointments, Pharmacy, Lab, Rooms, or any other) has real UI —
  the five module routes under `/b/:businessId/branch/:branchId/` render one shared placeholder.
- No business category, type, business, or branch other than the single Healthcare/Hospital/ABC
  City Hospital/Main Branch sample exists in mock data.
- No PRD exists yet for any business module in this repository.
- No decision on how the mock↔real API implementation switch will be triggered (env var, build
  flag, or other mechanism) — ADR-010 explicitly defers this.
- No generic `Sidebar`/`TopBar` primitives exist under `components/navigation/`; the current shell
  is bespoke `app/`-level composition.
- `Toaster` is implemented but not mounted anywhere in the application.
- The mock engine has no free-text search/filter and no data persistence beyond the running
  process.

## 16. Confirmed vs Assumed

**CONFIRMED** (directly verified in code/docs):

- The technology stack listed in §2.
- The six-layer architecture and its ESLint-enforced dependency direction.
- The module folder convention and the `index.ts` public-API rule.
- The `shared/api` → `ResourceClient<T>` → mock-engine data-flow pattern.
- The `business-context` module's types, mock data, hooks, and `RequireModule` guard behavior.
- The design-token/theming implementation and the current icon set.
- The exact list of implemented vs. placeholder-only modules and component categories.
- The current routing tree.
- The testing/lint/build tooling and scripts.

**ASSUMED** (implemented in code but not formalized in an ADR or equivalent decision record):

- The `/b/:businessId/branch/:branchId/...` URL scheme as a durable production URL structure —
  it is implemented and working, but no ADR documents it as a final decision.
- That every future business module will follow the same `types/mock-data/services/hooks/index.ts`
  pattern established by `customers` and `business-context` — stated as intent in ADR-010's
  consequences, not independently ratified per module.

**NOT YET DECIDED** (explicitly open per the repository's own documentation):

- Whether Innovoot is a purely behind-login product or has public-facing surfaces — ADR-005 flags
  this as unconfirmed and relevant to the SPA/SSR tradeoff.
- Whether the SPA architectural choice should be revisited for SEO reasons (ADR-005, conditional).
- The mock↔real API switching mechanism (ADR-010, explicitly deferred).
- Any business category, type, or module configuration beyond the single Healthcare/Hospital
  sample — Hospitality, Restaurant, Retail, and Education are named only as category labels with
  no modeled types, businesses, or modules in the repository.
- Whether entities such as Doctor, Department, Encounter, or Product/Medicine become their own
  modules, nested views, or shared concepts — not decided in this repository.
