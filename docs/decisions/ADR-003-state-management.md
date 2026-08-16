# ADR-003: State management

**Status:** Accepted

## Context

A ~12-module business app needs a consistent answer for three distinct kinds of state:
server/cache state (data fetched from an eventual backend), cross-module client state (e.g. "who
is logged in", UI preferences), and form state. Picking these per-module would fragment patterns
across the codebase and make it harder for both new contributors and AI agents to predict how
state is handled in a module they haven't seen before.

## Decision

- **Server state:** TanStack Query, configured once in `app/providers/AppProviders.tsx`. Module
  `services/` will expose query/mutation hooks built on it once `shared/api` and a real backend
  exist. Not used for anything that isn't fetched from a server.
- **Client state:** Zustand, used sparingly — only for state that genuinely needs to be shared
  across modules or survive route changes (e.g. an eventual auth/session store). Local component
  state (`useState`/`useReducer`) remains the default; don't reach for Zustand for state that's
  only ever read by one component tree.
- **Forms:** react-hook-form for form state/validation wiring, zod for schema definition and
  validation logic — the same zod schemas double as the runtime validation described in
  `modules/*/validation/`.

## Consequences

- Three distinct tools for three distinct concerns, rather than one library doing everything —
  intentional, since conflating server-state caching with client UI state is a common source of
  bugs (stale cache vs. stale UI state behaving differently).
- No global Redux-style store — if a future requirement genuinely needs it (e.g. complex
  undo/redo, time-travel debugging), revisit in a new ADR rather than retrofitting.
