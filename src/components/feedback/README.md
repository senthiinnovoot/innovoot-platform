# components/feedback

User feedback primitives — static state displays (`Alert`, `LoadingState`, `EmptyState`,
`ErrorState`) and a transient toast notification system (`Toast`, `Toaster`, `useToast`).

**Status:** Phase 3B — `Alert`, `LoadingState`, `EmptyState`, `ErrorState`, `Toast`, `Toaster`,
`useToast`. `ConfirmDialog` intentionally not built yet — no consumer or focus-trap/portal design
decision made for it.

## Rule

Everything here must be reusable across unrelated modules with no import
from `modules/`. If a component needs to know about customers, orders, or
any other business domain, it belongs in that module's `components/`
folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing
modules for something close enough to extend — see the reusability rules
in `CLAUDE.md`.

## Four data-fetching states

`LoadingState`, `ErrorState`, and `EmptyState` correspond directly to three of the four states
every data-fetching UI must account for (CLAUDE.md §12) — the fourth, success, is just the
module's real content. None of these three have any API/query knowledge; a module wires them to
its own fetch state.

## Static vs. transient

`Alert` is static, inline page content (e.g. a persistent warning banner) — use `role="alert"`
(error) or `role="status"` (info/success/warning) semantics baked in. `Toast` is a transient,
auto-dismissing notification rendered by `Toaster`, driven by `useToast()`.

## Toast system

```
useToast()  →  zustand store (useToastStore)  →  Toaster (viewport, one live region)  →  Toast (presentational, one per item)
```

```tsx
const { toast } = useToast()
toast({ variant: 'success', title: 'Saved', description: 'Your changes were saved.' })
```

- `duration` defaults to `5000`ms; `0` means persistent until manually dismissed.
- `Toaster` owns exactly **one** shared `role="region" aria-live="polite"` for the whole stack —
  individual `Toast`s don't carry their own live-region role, to avoid double-announcing.
- Auto-dismiss timers live outside the store and are always cleared through `dismiss()`, however a
  toast is removed (expiry, manual dismissal, or otherwise) — see `useToast.ts` for why.
- **`Toaster` is not mounted anywhere in `app/`.** Mounting it is an application-shell decision for
  a later phase, not this component layer.
