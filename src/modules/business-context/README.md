# modules/business-context

Owns the frontend representation of Tenant → Business → BusinessType → Branch → enabled Modules,
and the current business/branch context every other module operates within. See
`docs/decisions/ADR-010-mock-real-api-abstraction-strategy.md` for the mock/real API pattern this
follows, and the architecture-reconciliation discussion that established this module.

**Status:** Phase 4A — `types/`, `mock-data/`, `services/`, `hooks/`, `components/RequireModule`,
`index.ts`. No UI beyond `RequireModule`'s guard behavior; the shell (Sidebar/TopBar/Dashboard)
that _consumes_ this module lives in `app/` and `modules/dashboard`, not here.

## Scope — what this module is and isn't

This module owns tenancy/business-configuration data — **not** a dumping ground for unrelated
platform functionality. If something isn't Tenant/Business/BusinessCategory/BusinessType/Branch/
Module/current-context, it doesn't belong here.

## Current internal structure

```text
modules/business-context/
├── types/business-context.ts        # Tenant, Business, BusinessCategory, BusinessType, Branch, Module, BusinessContext
├── mock-data/business-context.json  # fictional seed matching the backend dev's sample hierarchy
├── services/business-context.service.ts  # resolves the BusinessContext bundle via shared/api ResourceClient
├── hooks/useBusinessContext.ts      # reads businessId/branchId from the URL (source of truth) via TanStack Query
├── components/RequireModule.tsx     # route guard — hides a module's routes when its business type doesn't enable it
└── index.ts
```

## URL is the source of truth

`useBusinessContext()` reads `businessId`/`branchId` from route params (`/b/:businessId/branch/:branchId/...`),
not from a separately-stored id — there is no competing source of truth for "which business/branch
is current." Zustand is not used in this module: TanStack Query's cache, keyed on the URL params,
already covers everything this phase needs.

## Rules

- Everything except `index.ts`'s exports is private to this module.
- Other modules (a future `patients`, `appointments`, ...) import `useBusinessContext`,
  `useIsModuleEnabled`, or `RequireModule` from `modules/business-context`'s `index.ts` — never
  from its internal files.
- `mock-data/business-context.json` is imported only by `services/business-context.service.ts`.
