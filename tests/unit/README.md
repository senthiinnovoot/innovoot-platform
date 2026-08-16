# tests/unit

Unit tests for pure logic: `shared/utils`, `shared/validation`, module
`hooks`/`services` in isolation (mocked dependencies), reducers/stores.

Co-located tests (`Component.test.tsx` next to `Component.tsx` inside
`src/`) are also valid and preferred for component tests — this folder is
for tests that don't have a natural single source file to sit beside
(cross-cutting logic, multi-file scenarios).

Run: `pnpm test`
