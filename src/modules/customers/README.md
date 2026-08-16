# modules/customers

Customer records: profiles, contact info, history, and relationships to orders/appointments.

**Status:** Phase 4 — data layer only, built as the proof-of-concept for the mock/real API
architecture (see `docs/decisions/ADR-010-mock-real-api-abstraction-strategy.md`). `types/`,
`mock-data/`, `services/`, `hooks/`, and `index.ts` exist. **No UI yet** — `components/`, `pages/`,
and `validation/` are intentionally not built this phase; that's the "First Business Module" stage,
not "API & Data Architecture."

The `Customer` model (`id`, `name`, `email`, `phone`, `status`, `createdAt`) is deliberately
minimal and illustrative — it exists to prove the architecture, not as the final Innovoot customer
schema. All mock data is fictional.

## Current internal structure

```text
modules/customers/
├── types/customer.ts              # Customer, CreateCustomerInput, UpdateCustomerInput
├── mock-data/customers.json       # fictional seed data — only services/ may import this
├── services/customers.service.ts  # calls shared/api's ResourceClient, never fetch() directly
├── hooks/useCustomers.ts          # TanStack Query wrapper around customersService
└── index.ts                       # public API — useCustomers, customersService, types
```

## Planned internal structure (once UI work begins)

```text
modules/customers/
├── components/   # Business-specific UI (e.g. CustomerCard, CustomerTable) — not shared/ui
├── pages/        # Route-level page components composed for app/routes
├── validation/   # zod schemas for this module's forms/data
└── ...           # (existing structure above)
```

## Rules

- Everything in this folder except `index.ts`'s exports is private to this module.
- Other modules (e.g. `orders` needing customer data) must import from
  `modules/customers` (its `index.ts`), never from
  `modules/customers/services/...` or any other internal path directly.
- `mock-data/customers.json` is imported **only** by `services/customers.service.ts` — no
  component, page, or hook should import it directly.
- Business-specific components live here, not in `components/`. Only promote
  a component to `components/` if it is genuinely generic and reusable
  across unrelated modules — see docs/architecture/module-architecture.md.
