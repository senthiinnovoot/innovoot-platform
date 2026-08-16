# Module Architecture

## Standard module shape

Every business module under `src/modules/<name>/` follows the same internal structure:

```text
modules/customers/
│
├── components/    # Business-specific UI (CustomerCard, CustomerTable)
├── pages/         # Route-level page components
├── hooks/         # Module-scoped React hooks
├── services/      # Data access — built on shared/api, never fetch() directly
├── types/         # Module-scoped TypeScript types
├── validation/    # zod schemas for this module's forms/data
└── index.ts       # Public API — the ONLY thing other modules may import
```

Not every module needs every subfolder on day one — create only what's justified, per the
project's general anti-over-engineering principle. A module with no cross-module consumers yet
can start with just `pages/` and `services/` and grow the rest as needed.

## Business-specific vs. generic

```text
Business-specific → modules/<name>/components/
Generic/reusable   → components/<category>/
```

The test is not "is this used more than once" — it's "does this component know about a business
domain". `CustomerCard` knows what a customer is; it belongs in `modules/customers/components/`
even if, hypothetically, both `customers` and `leads` wanted a visually identical card. A
component only qualifies for `components/` if it is domain-agnostic — `Card`, the generic layout
primitive `CustomerCard` is built from, belongs there.

Never move a business-specific component into `components/` just because it's reused in two
places — see the reusability rules in `CLAUDE.md`. Two domain modules can independently compose
the same generic `components/cards/Card` primitive without the primitive needing to know
anything about either domain.

## Component layers

```text
Layer 1 — Primitive UI        components/ui/          Button, Input, Select, Badge, ...
Layer 2 — Composite UI        components/{forms,...}/  FormField, DataTable, FilterBar, ...
Layer 3 — Business components modules/<name>/components/  CustomerCard, OrderSummary, ...
Layer 4 — Pages               modules/<name>/pages/    Compose Layer 3 + module logic
```

A higher layer may depend on lower layers; a lower layer must never depend on a higher one (this
mirrors the layer rules in [dependency-rules.md](./dependency-rules.md)). Pages should stay thin
— compose business and generic components rather than reimplementing UI or fetching logic inline.

## The `index.ts` contract

A module's `index.ts` is its public API. Anything not re-exported from `index.ts` is private to
the module and must not be imported directly by anything outside it (enforced by ESLint —
`boundaries/entry-point` in `eslint.config.js`). Concretely:

```ts
// modules/leads/index.ts
export { LeadsPage } from './pages/LeadsPage'
export { useLeadPipeline } from './hooks/useLeadPipeline'
export type { Lead } from './types/lead'
// NOT exported: internal services/validation helpers other modules have no business touching
```

When `orders` needs data owned by `customers`, it imports from `modules/customers` (its
`index.ts`), never from `modules/customers/services/customers.service.ts` directly. If the public
API doesn't expose what a consumer needs, that's a signal to deliberately widen the module's
public API — not to reach around it.

## Adding a new module

1. Confirm the domain doesn't already belong inside an existing module.
2. Create `src/modules/<name>/` with only the subfolders you need immediately.
3. Add `index.ts` exporting the module's intended public surface, even if minimal at first.
4. Add a route registration in `app/routes/router.tsx` pointing at the module's page(s).
5. Add module-specific docs under `docs/modules/<name>.md` once the module has real behavior
   worth documenting beyond what's self-evident from the code.
