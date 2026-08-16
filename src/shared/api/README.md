# shared/api

The single, shared HTTP/data-access layer — a generic, domain-agnostic API abstraction that every
module's `services/` build on. No module should call `fetch()` or construct request URLs directly,
and no module should import mock data directly — everything goes through this layer.

**Status:** Phase 4 — `types.ts` (`ApiError`, `QueryParams`, `PaginatedResponse<T>`,
`ResourceClient<T>`), `resource-client.ts` (`createResourceClient` — the single entry point every
module's service uses), `mock/create-mock-resource-client.ts` (the generic mock CRUD/pagination
engine). See `docs/decisions/ADR-010-mock-real-api-abstraction-strategy.md` for the full design and
how this swaps to a real HTTP-backed implementation once Express/MySQL exist.

## Rule

`shared/` may depend on `design-system/` but must never import from
`modules/`, `components/`, or `app/` — see
docs/architecture/dependency-rules.md. Keep this layer generic; anything
domain-specific belongs in a module.

## Usage

```ts
// modules/<name>/services/<name>.service.ts
import { createResourceClient } from '@shared/api'

const client = createResourceClient<MyType>({ data: myMockData, endpoint: '/my-resource' })
export const myService = {
  list: (params) => client.list(params),
  get: (id) => client.get(id),
  // ...
}
```

Only a mock implementation exists today — `createResourceClient` always returns
`createMockResourceClient`. Nothing that calls `createResourceClient` needs to change when a real
HTTP implementation is added later; see ADR-010.
