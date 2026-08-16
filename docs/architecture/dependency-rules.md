# Dependency Rules

## The allowed graph

```text
app
 └─→ modules, components, shared, design-system, infrastructure

modules/<x>
 └─→ components, shared, design-system, infrastructure, modules/<y>'s index.ts only

components
 └─→ components, shared, design-system

shared
 └─→ shared, design-system

design-system
 └─→ design-system   (nothing — this is the foundation layer)

infrastructure
 └─→ infrastructure   (a leaf integration layer)
```

Nothing may import from `app/` — it sits at the top of the graph and nothing needs to.

Disallowed, explicitly:

```text
modules/customers → modules/leads/services/*        (internal reach-in; use modules/leads's index.ts)
components/*      → modules/*                       (generic UI must stay domain-agnostic)
shared/*          → modules/*, components/*, app/    (shared logic must stay generic)
design-system/*   → anything above it
```

## Why this direction

Lower layers (`design-system` → `shared` → `components`) are the most-reused, most-stable code
in the project — a change there can ripple through every module. Keeping them free of upward
dependencies means they can be reasoned about, tested, and changed in isolation, and it prevents
accidental circular dependencies between modules (which is what actually causes "can't safely
change anything" codebases at scale).

## How this is enforced (not just documented)

`eslint.config.js` configures `eslint-plugin-boundaries` (v7) with two rules:

- **`boundaries/dependencies`** — enforces the layer graph above (which _element types_ may
  import which). Element types are derived from folder location:
  `src/app/*`, `src/modules/*` (captures the module name), `src/components/*`, `src/shared/*`,
  `src/design-system/*`, `src/infrastructure/*`.
- **`boundaries/entry-point`** — enforces that a _cross-module_ import can only reach a module's
  `index.ts`, never an internal file. This rule does not fire for imports from within the same
  module (`modules/customers/pages/*` importing `modules/customers/services/*` is fine).

Both rules require **`import/resolver` (`eslint-import-resolver-typescript`) to be configured**
pointing at `tsconfig.app.json`. Without it, the plugin cannot resolve path-alias imports
(`@modules/leads`) to real files and silently treats them as unresolvable external packages —
which disables enforcement for every aliased import in the codebase without erroring. This was
verified empirically while setting up this config (see "Verification" below); if the resolver
config is ever removed, re-run the same checks before trusting the linter again.

### A note on this plugin version's rough edges

`eslint-plugin-boundaries@7` is mid-migration from a `rules`/`element-types` API to a
`policies`/`dependencies` API, and several combinations of settings that look reasonable (and
match the plugin's own deprecation-warning suggestions) silently no-op instead of erroring —
there is no feedback when a policy fails to match anything. Two specific traps we hit, so nobody
has to rediscover them:

1. The `default: 'disallow' | 'allow'` option on a rule is **global**, not scoped to the target
   types mentioned in your policies. If you only write a policy for `module` targets and leave
   other types unmentioned with `default: 'disallow'`, every _other_ target type gets silently
   blocked too. Every element type that rule cares about needs its own explicit policy.
2. Array-based glob negation (`disallow: ['**', '!index.ts']`) does **not** subtract the negated
   pattern the way `micromatch()`'s list-filtering mode does — `boundaries/entry-point` evaluates
   each array entry independently and ORs the matches, so `'**'` alone already matches
   everything, negation or not. Use an explicit `allow` whitelist (`allow: ['index.ts']`) instead
   of trying to express the same rule as a `disallow` blacklist.

If upgrading this plugin, re-run the verification below before trusting the new config.

## Verification

Because a misconfigured lint rule fails silently (exit 0, no errors) rather than loudly, don't
just trust that a config change achieves what its comments claim. Before merging changes to the
`boundaries/*` rules in `eslint.config.js`, manually verify with disposable test files (not
committed) that each of these is true:

| Scenario                                                       | Expected                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| `modules/x` imports `modules/y` internal file (not `index.ts`) | ❌ error                                                   |
| `modules/x` imports `modules/y`'s `index.ts`                   | ✅ clean                                                   |
| `modules/x` imports its own internal file                      | ✅ clean                                                   |
| `shared/*` imports from `modules/*`                            | ❌ error                                                   |
| `app/routes` imports `app/layouts`                             | ✅ clean (same `app` type, no boundary between subfolders) |

## Module public API

Beyond the layer graph, `modules/<name>/index.ts` is the required entry point for any
cross-module import — see [module-architecture.md](./module-architecture.md#the-indexts-contract).
