# modules/appointments

Scheduling, calendar views, booking, and appointment lifecycle management.

**Status:** not yet built (foundation stage only — see repo root `CLAUDE.md`).

## Planned internal structure

```text
modules/appointments/
├── components/   # Business-specific UI (e.g. AppointmentsCard, AppointmentsTable) — not shared/ui
├── pages/        # Route-level page components composed for app/routes
├── hooks/        # Module-scoped React hooks
├── services/     # Data access — calls shared/api, never fetch() directly
├── types/        # Module-scoped TypeScript types
├── validation/   # zod schemas for this module's forms/data
└── index.ts      # Public API — the ONLY thing other modules may import
```

## Rules

- Everything in this folder except `index.ts`'s exports is private to this module.
- Other modules (e.g. `orders` needing customer data) must import from
  `modules/appointments` (its `index.ts`), never from
  `modules/appointments/services/...` or any other internal path directly.
- Business-specific components live here, not in `components/`. Only promote
  a component to `components/` if it is genuinely generic and reusable
  across unrelated modules — see docs/architecture/module-architecture.md.
