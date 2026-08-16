# ADR-010: Mock/real API abstraction strategy

**Status:** Accepted

## Context

The real backend (Express + TypeScript + MySQL) is being built separately and doesn't exist yet.
Building business UI against nothing would mean either blocking on backend work or writing
throwaway ad-hoc fake data per page — both rejected. `ADR-004` already established that
`infrastructure/{database,authentication,...}/` are stub folders reserved for real backend/vendor
integrations, revisited once backend requirements are known; this ADR is that revisit for the
_data-access_ path specifically — deciding how the frontend fetches data _before_ that backend
exists, in a way that doesn't need rework once it does.

The goal: React UI code must not know or care whether data comes from local mock data or a future
real HTTP API. Swapping one for the other must not require rewriting pages, components, hooks, or
services.

## Decision

### Layering (uses the existing architecture, no new layer)

```text
Customer UI/Page          (not built this phase)
      ↓
useCustomers()              modules/customers/hooks/       — TanStack Query
      ↓
customersService            modules/customers/services/    — domain-specific, per module
      ↓
ResourceClient<T>           shared/api/                    — generic contract + factory
      ↓
mock implementation today   shared/api/mock/                 →  HTTP implementation later
      ↓
customers.json (mock data)  modules/customers/mock-data/
```

`shared/api/` was already documented (`shared/api/README.md`) as "the single, shared HTTP/data-access
layer... every module's `services/` build on" — this ADR implements that, rather than introducing a
new `infrastructure/api/` layer as first proposed. That would have conflicted with the existing
dependency graph (`shared` cannot import `infrastructure`; `infrastructure` is documented as the
integration point for _real_ vendor/backend SDKs, not a generic data contract) and with
module-first architecture (`customer-service.ts` is domain-specific code — CLAUDE.md §2 says
business functionality lives under `modules/<name>/`, never grouped by technical layer at the
top level). `infrastructure/` remains untouched, reserved for when Express/MySQL are actually
wired in (auth tokens, DB pooling, etc. — not the data-fetching contract itself).

### `shared/api/` — generic, domain-agnostic

- **`types.ts`** — `ApiError` (a real `Error` subclass with `status`/`code`), `QueryParams`
  (`page`, `pageSize`, `sortBy`, `sortDirection`), `PaginatedResponse<T>`, and the `ResourceClient<T>`
  interface every implementation (mock today, HTTP later) satisfies.
- **`resource-client.ts`** — `createResourceClient<T>(config)`, the **single entry point** every
  module's service uses. Currently always returns the mock implementation. `config.endpoint` is
  accepted and stored today but unused by the mock — it exists now specifically so nothing about a
  module's service code needs to change when a real endpoint path is wired in later.
- **`mock/create-mock-resource-client.ts`** — one generic, reusable in-memory CRUD/pagination
  engine, built once, with **zero knowledge of what `T` is**. Every future module (`leads`,
  `appointments`, `orders`, ...) reuses this same factory — this is what makes it "a reusable
  API/data architecture," not a separate fake per entity.

`shared/api/` has no knowledge of `Customer`, `Lead`, `Appointment`, `Order`, or any other business
concept — verified by grep as part of this phase's quality gates.

### Mock implementation — deliberately minimal

Supports `list` (with pagination + sorting), `get`, `create`, `update`, `remove`. Simulates
artificial latency (configurable, default 300ms) so the app genuinely exercises async/loading UI
states rather than resolving synchronously — this matters for it being a faithful stand-in for a
real network call. Deliberately excludes: persistence beyond the process lifetime, a general
search/filter engine (would require per-entity field knowledge this layer shouldn't have), and
random failure injection (would make local dev flaky for no benefit). These can be revisited if a
real requirement emerges — not built speculatively now.

### Module responsibility (`modules/customers/` as the proven pattern)

- `types/customer.ts` — the `Customer` shape, `CreateCustomerInput`/`UpdateCustomerInput`.
  Deliberately minimal/illustrative (`id`, `name`, `email`, `phone`, `status`, `createdAt`) — not
  the final schema.
- `mock-data/customers.json` — the only file business code should never import directly.
- `services/customers.service.ts` — the **only file that imports `customers.json`**, calls
  `createResourceClient` once, and exposes `getCustomers`/`getCustomer`/`createCustomer`/
  `updateCustomer`/`deleteCustomer`. This matches the module's already-documented standard shape
  (`module-architecture.md`: `services/` — "Data access — built on `shared/api`, never `fetch()`
  directly").
- `hooks/useCustomers.ts` — wraps `customersService.getCustomers` in TanStack Query
  (`useQuery`), per `ADR-003`'s existing state-management decision (server state → TanStack Query,
  configured once in `AppProviders.tsx`; not Zustand — Zustand stays reserved for genuinely
  cross-module client state).
- `index.ts` — the module's public surface (`useCustomers`, `customersService`, `Customer` +
  input types). Nothing outside this module ever imports `modules/customers/services/*` or
  `modules/customers/mock-data/*` directly.

### How the future HTTP/Express/MySQL swap works

Only `createResourceClient` (one file, `shared/api/resource-client.ts`) changes: it currently
always constructs a mock client; later it constructs an HTTP-backed client satisfying the exact
same `ResourceClient<T>` interface, using each config's already-declared `endpoint`. Every
module's service, every hook, and every future page/component stays untouched — they were always
written against `ResourceClient<T>`, never against "mock" or "HTTP" directly.

**Explicitly deferred, not decided by this ADR:** the actual mock↔real _switching mechanism_ (env
var, build flag, DI). `app/config/env.ts` explicitly forbids reading `import.meta.env` from
`shared`/`modules`/`components` directly, and `shared/` cannot import from `app/` per the
dependency graph — so a clean switch needs a small, deliberate design of its own once a real
backend actually exists to switch to. Per `ADR-004`'s own instruction, that's revisited then, not
guessed at now.

## Consequences

- Every future module (`leads`, `appointments`, `orders`, ...) follows the exact same three-file
  pattern (`types/`, `mock-data/` + `services/`, `hooks/`) established by `customers` here — no
  new architectural decision needed per module.
- Adding a real backend later touches `shared/api/resource-client.ts` (add the HTTP
  implementation) and, separately, whatever the eventual switching mechanism turns out to be — it
  does not touch any module's `services/`, `hooks/`, `components/`, or `pages/`.
- `ApiError` is the one error shape all callers (present and future) can rely on, regardless of
  which implementation is behind the client.
- This ADR should be revisited alongside `ADR-004` once Express/MySQL implementation actually
  begins — not silently expanded before then.
