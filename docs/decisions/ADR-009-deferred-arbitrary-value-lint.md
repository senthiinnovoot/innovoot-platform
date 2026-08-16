# ADR-009: Deferred automated enforcement of "no arbitrary Tailwind values"

**Status:** Accepted — revisit periodically

## Context

The project brief asks that arbitrary design values (`bg-[#123456]`, `p-[17px]`) be avoided in
favor of tokens/scale values. Phase 1 established that architecture rules in this project should
be _enforced_, not just documented, wherever practical (see
docs/decisions/ADR-006-module-boundary-enforcement.md). An ESLint plugin enforcing this for
Tailwind classes was evaluated for Phase 2.

## Decision

**Do not add an arbitrary-value lint rule yet.** The mainline `eslint-plugin-tailwindcss` package
does not reliably support Tailwind v4 at the time of writing; the ecosystem has fragmented into
several community forks (`eslint-plugin-tailwindcss-v4`, `@poupe/eslint-plugin-tailwindcss`) that
are pre-1.0 and not established enough to depend on for a Phase 2 foundation, especially after
Phase 1 already spent significant effort working around a different ESLint plugin's (
`eslint-plugin-boundaries`) v7 migration rough edges. Betting on a second immature plugin in the
same phase is not a good trade.

Enforcement for now is: the documented rule in CLAUDE.md, code review, and the fact that every
foundational component already only uses token-backed utility classes (nothing to imitate an
arbitrary value from). `prettier-plugin-tailwindcss` (already installed) sorts classes but does
not forbid arbitrary ones — it doesn't cover this gap.

## Consequences

- This is a real, acknowledged gap relative to Phase 1's "enforce, don't just document"
  standard — noted explicitly rather than silently skipped.
- Revisit when either the mainline plugin ships stable v4 support, or a community fork reaches
  a version/adoption level worth trusting (check npm download counts and recent commit activity,
  not just that a v4-labeled package exists).
- If arbitrary values start appearing in code review despite the documented rule, that's the
  trigger to re-evaluate this decision sooner rather than waiting for the ecosystem to mature.
