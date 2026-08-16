# CLAUDE.md — Innovoot Development Standards

This file is the permanent set of development rules for this project. Read it before making any
change. If a request conflicts with what's written here, say so, explain the conflict, propose
the better approach, and wait for approval before proceeding if the decision materially affects
architecture — do not silently deviate.

## 1. Pipeline discipline

Development proceeds in this order; do not skip stages or jump ahead to business features before
the foundation stages are approved:

```text
Project Understanding → Architecture → Folder Structure → Development Rules →
Design System → Shared Components → Module Foundation → First Business Module →
Testing → Review → Next Module
```

As of this writing, Phase 1 (Project Understanding → Architecture → Folder Structure →
Development Rules, plus strategy docs for Design System and Shared Components) and Phase 2
(Design System — tokens, theming, and a small foundational component set) are complete. See
`docs/architecture/overview.md` for what each phase does and does not include.

## 2. Architecture rules

- Module-first: business functionality lives under `src/modules/<name>/`, organized by domain,
  never by technical layer at the top level.
- Dependency direction is one-way: `app → modules/components/shared/design-system → design-system`.
  Full graph and rationale: `docs/architecture/dependency-rules.md`. This is enforced by ESLint
  (`eslint-plugin-boundaries` in `eslint.config.js`), not just documented — `pnpm lint` will fail
  on a violation.
- A module's public API is its `index.ts`. Other modules may only import from there, never from
  an internal file (`modules/x/services/*.ts`, etc.) — see
  `docs/architecture/module-architecture.md`.
- Business-specific components live in their module (`modules/<name>/components/`); only
  genuinely domain-agnostic components belong in `components/`. See the reusability rules below
  before creating either.
- Don't introduce a new top-level architectural layer (a new sibling to `app/modules/components/
shared/design-system/infrastructure`) without a new ADR under `docs/decisions/`.

## 3. Folder & naming conventions

| What                              | Convention                                                                               | Example                                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Folders                           | kebab-case                                                                               | `data-display/`, `design-system/`                                                             |
| Module/component folders          | kebab-case, singular where it names a concept, plural where it names a collection domain | `modules/customers/`, `components/ui/`                                                        |
| React components (files + export) | PascalCase                                                                               | `CustomerCard.tsx` exporting `CustomerCard`                                                   |
| Hooks                             | camelCase, `use` prefix                                                                  | `useLeadPipeline.ts`                                                                          |
| Utility/plain functions           | camelCase                                                                                | `formatCurrency.ts`                                                                           |
| Types/interfaces                  | PascalCase, no `I`/`T` prefix                                                            | `type Customer`, not `ICustomer`                                                              |
| zod schemas                       | camelCase, `Schema` suffix                                                               | `customerSchema`, inferred type via `z.infer`                                                 |
| Test files                        | co-located, `.test.ts(x)` suffix                                                         | `CustomerCard.test.tsx` next to `CustomerCard.tsx`                                            |
| Constants                         | SCREAMING_SNAKE_CASE for true constants, camelCase for config objects                    | `MAX_PAGE_SIZE`, `queryClientDefaults`                                                        |
| Path aliases                      | mirror the folder they point to                                                          | `@modules/*`, `@shared/*`, `@design-system/*`, `@components/*`, `@app/*`, `@infrastructure/*` |

Every module (`modules/<name>/`) and component category (`components/<category>/`) folder has a
`README.md` describing its purpose and rules, even while empty — see
`docs/architecture/folder-structure.md` for why.

## 4. Component conventions

Build in layers — see `docs/architecture/module-architecture.md#component-layers`:

1. **Primitive UI** (`components/ui/`) — no business logic, no data fetching.
2. **Composite UI** (`components/{forms,tables,cards,navigation,feedback,data-display}/`) —
   generic composition of primitives (`DataTable`, `FormField`, `FilterBar`), still
   domain-agnostic.
3. **Business components** (`modules/<name>/components/`) — domain-aware (`CustomerCard`).
4. **Pages** (`modules/<name>/pages/`) — compose layers 2–3 plus module hooks/services. Pages
   should stay thin; if a page file is doing significant logic inline, extract it to a hook or
   service.

## 5. Reusability rules

Before creating a new component or utility:

1. Search the existing codebase for something close.
2. Check `components/` (generic) and `shared/` (generic logic) first.
3. Check the current module for something to extend.
4. Check other modules for a prior-art pattern (even if it needs to move to `components/` to be
   shared — see the promotion rule below).
5. Only create something new when none of the above fit, and say so explicitly if it's a
   judgment call.

Never duplicate an existing component without a documented reason (a comment, or a note in the
PR/commit description). A component only gets promoted from a module into `components/` when it
becomes genuinely domain-agnostic — not merely because it's used in two modules.

## 6. Dependency & third-party library rules

Do not add a new dependency without explaining: why it's needed, what alternatives were
considered, its maintenance/community-health profile, and its bundle/performance impact (check
with `pnpm build` + the reported bundle size, or a bundle analyzer for anything nontrivial). See
`docs/decisions/ADR-002-technology-stack.md` for the format this reasoning should take. Don't add
a dependency to solve a problem that's a few lines of `shared/utils` — but don't reinvent a
well-solved problem (date handling, form state, HTTP caching) either.

## 7. Design system rules

Design tokens (color, typography, spacing, radius, shadow, z-index, motion) are implemented in
`src/index.css` — see `docs/design-system/tokens.md` for the full current token set and
`docs/decisions/ADR-007-theming-architecture.md` for the theming architecture. The following
rules apply to all component/module code:

1. **Never introduce an arbitrary color when a semantic token exists.** No raw hex/rgb values or
   Tailwind arbitrary-value color classes — use the semantic token (`bg-primary`, `text-error`,
   `border-border`), not a raw palette value, and never a component-local color decision.
2. **Never introduce arbitrary spacing when the spacing scale is sufficient.** Use Tailwind's
   spacing scale (`p-4`, `gap-2`, ...); only reach for an arbitrary value (`p-[17px]`) with a
   documented reason (a comment explaining why the scale doesn't fit), treated as tech debt to
   revisit.
3. **Reuse design-system primitives** (`components/ui/Button`, `Text`, `Input`, `Card`, `Badge`,
   `ThemeToggle`) instead of re-implementing equivalent markup/styling inline — see the
   reusability rules in §5 before building something new.
4. **Do not create duplicate design tokens.** A token is defined exactly once, in
   `src/index.css` (`:root` + `.dark`). Don't redefine an equivalent value under a different name,
   and don't maintain a parallel JS/TS token object — see `docs/design-system/tokens.md#source-of-truth`.
5. **Do not create component-specific design-system values** (a color, spacing, or radius value
   that only one component uses) unless justified and noted as such — prefer extending or
   reusing an existing semantic token category first.
6. **Components must support light and dark themes where applicable.** Use semantic tokens
   (`bg-background`, `text-foreground`, ...), which resolve per-theme automatically — never branch
   on `theme === 'dark'` in component code, and never hardcode a color that only looks right in
   one theme. See ADR-007 for why raw Tailwind `dark:` utilities need the project's
   `@custom-variant dark` override to work at all, and prefer semantic tokens over `dark:` anyway.
7. **Components must consider accessibility** — see the full accessibility rules in §8.
8. **Components must support responsive behavior where applicable** — see the responsive design
   rules in §9.

```text
Avoid:  color: #123456;         padding: 17px;        border-radius: 13px;
        className="bg-[#123456]"  className="p-[17px]"
Prefer: className="bg-primary"  className="p-4"       className="rounded-md"
```

Automated enforcement of rule 1/2 (no arbitrary Tailwind values) is deliberately deferred — see
`docs/decisions/ADR-009-deferred-arbitrary-value-lint.md` for why and when to revisit. Enforcement
today is this document, code review, and the fact that every foundational component already only
uses token-backed classes.

Icons come from `design-system/icons/` (a thin wrapper around `lucide-react`), not imported
directly from `lucide-react` in module/component code, once that wrapper exists. Currently
`lucide-react` is imported directly in the few places icons are used (e.g. `ThemeToggle`) — see
`docs/design-system/tokens.md#icons` for why the wrapper wasn't built yet.

## 8. Accessibility rules

- `eslint-plugin-jsx-a11y` (recommended ruleset) runs as part of `pnpm lint` — a11y violations
  are lint errors, not suggestions.
- Every interactive element must be reachable and operable via keyboard, with a visible focus
  state (the `ring` token + `:focus-visible` styling — see `components/ui/Button.tsx` for the
  pattern to follow).
- Prefer semantic HTML elements over generic `div`/`span` plus ARIA where a native element
  already provides the right semantics and behavior (`button`, not `div role="button"`).
- Images need meaningful `alt` text (or `alt=""` for decorative images) — never omit it.
- Form inputs need an associated label (visible or `sr-only`), not just a placeholder — see
  `components/ui/Input.tsx` for the `useId()` + `aria-describedby`/`aria-invalid` pattern for
  hints and errors.
- Don't rely on color alone to convey state (error/success/warning) — pair with text or an icon.
- Disabled elements must use the native `disabled` attribute (or `aria-disabled` when the element
  can't be natively disabled) and a visibly distinct style — see `components/ui/Button.tsx`.
- Respect `prefers-reduced-motion` for any non-trivial animation — enforced globally via the
  `@media (prefers-reduced-motion: reduce)` rule in `src/index.css`; don't bypass it with
  inline/JS-driven animations that ignore the media query.

## 9. Responsive design rules

- Design mobile-first; use Tailwind's default breakpoints unless a documented product reason
  requires custom ones (record that as a token decision, not an ad-hoc one-off).
- Test at minimum: narrow mobile (~375px), tablet (~768px), and desktop (~1280px+).
- Avoid fixed pixel widths on layout containers; prefer relative units and Tailwind's
  responsive/flex/grid utilities.

## 10. Testing rules

- **Unit tests** (Vitest): pure logic — `shared/utils`, `shared/validation`, hooks/services in
  isolation. Co-locate with the source file (`Thing.test.ts` next to `Thing.ts`) by default;
  use `tests/unit/` only for cross-cutting logic without one obvious home file.
- **Integration tests** (Vitest + Testing Library): a module's pieces together, network mocked
  at the boundary. `tests/integration/`.
- **E2E tests** (Playwright): critical cross-module user flows against a real build.
  `tests/e2e/`. Add these once the corresponding flows exist — there's little to cover
  end-to-end during the foundation stage.
- Every new component/hook/service should ship with a test covering: the happy path, at least
  one error/edge case, and (for UI) loading/empty states where applicable.
- `pnpm test`, `pnpm test:coverage`, `pnpm test:e2e` — see `package.json` scripts. `pnpm verify`
  runs typecheck + lint + format check + unit tests together; run it before considering work done.

## 11. Performance rules

- Prefer code-splitting at the route/module level (React Router's lazy route loading) once
  modules exist — don't bundle every module into the initial load.
- Avoid unnecessary re-renders: don't put fast-changing state in a context/store consumed by
  large subtrees; scope it narrowly or use a selector-based store (Zustand supports this
  natively).
- Watch bundle size on `pnpm build` output — flag any single dependency addition that meaningfully
  moves the number (see dependency rules above).
- Use TanStack Query's caching (`staleTime`, `gcTime`) deliberately rather than accepting
  defaults blindly once real endpoints exist — see `app/providers/AppProviders.tsx`.

## 12. Error handling, loading, and empty states

Every data-fetching UI must account for all four states before it's considered complete:
loading, error, empty (zero results, not an error), and success. `components/feedback/` and
`components/data-display/` will hold the generic primitives for these
(`LoadingState`/`ErrorState`/`EmptyState`) once built — use them rather than ad-hoc
per-module spinners/error text.

## 13. Git conventions

- Conventional Commits style messages (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`,
  `test:`), focused on the _why_, not just the _what_.
- `husky` + `lint-staged` run `eslint --fix` and `prettier --write` on staged files pre-commit
  (see `.husky/pre-commit`, `package.json` `lint-staged` config) — don't bypass with
  `--no-verify` without a documented reason.
- One logical change per commit where reasonable; don't mix an architecture change with an
  unrelated feature commit.
- Only create commits when explicitly asked to.

## 14. Documentation rules

- Architecture-level docs live in `docs/architecture/`; keep them in sync with
  `eslint.config.js`'s actual enforced rules — if they drift, the lint config is the source of
  truth (fix the doc).
- Significant architectural decisions get an ADR under `docs/decisions/`
  (`ADR-NNN-short-title.md`), following the existing ADRs' Context/Decision/Consequences format.
  "Significant" means: hard to reverse, affects multiple modules, or was a close call between
  real alternatives.
- Per-module docs (`docs/modules/<name>.md`) are added once a module has behavior worth
  documenting beyond what's obvious from its code — not required for every module from day one.

## 15. Quality gates

Before considering any implementation complete, check:

```text
✓ Type checking        pnpm typecheck
✓ Linting (incl. a11y, architecture boundaries)   pnpm lint
✓ Formatting            pnpm format:check
✓ Unit tests            pnpm test
✓ Integration tests, where applicable
✓ E2E tests, for important user flows once they exist
✓ Accessibility          (manual keyboard/screen-reader spot check for new UI)
✓ Responsive behavior    (spot check at mobile/tablet/desktop)
✓ Performance            (bundle size delta, unnecessary re-renders)
✓ Error / loading / empty states
✓ Duplicate code / duplicate components   (see reusability rules)
✓ Architecture violations                 (pnpm lint catches boundary violations)
```

`pnpm verify` runs the automatable subset of this list in one command.

## 16. AI-assisted development

This project is actively developed with AI assistance, so:

- Keep files small and focused — a file doing one clear thing is easier for both humans and
  agents to reason about than a large multi-purpose one.
- Prefer explicit interfaces (typed function signatures, exported types) over implicit/inferred
  contracts that require reading implementation to understand.
- Avoid clever/implicit abstractions (magic decorators, deeply dynamic code, implicit global
  side effects) — an agent reading one file in isolation should be able to understand it without
  needing to trace hidden behavior elsewhere.
- Every currently-empty folder has a `README.md` explaining its purpose and rules — keep this
  pattern going as new folders are added.
- Don't over-engineer: prefer the simplest solution that satisfies the current requirement, and
  say so explicitly when choosing simplicity over a more "complete" abstraction.

## 17. Reference docs

- `docs/architecture/overview.md` — what this project is and why it's structured this way.
- `docs/architecture/folder-structure.md` — the full folder tree, annotated.
- `docs/architecture/module-architecture.md` — module internals, layering, the `index.ts` contract.
- `docs/architecture/dependency-rules.md` — the enforced dependency graph and how ESLint enforces it.
- `docs/design-system/tokens.md` — the implemented token system (color, typography, spacing,
  radius, shadow, z-index, motion) and theming.
- `docs/decisions/` — ADRs for every significant architectural decision made so far.
