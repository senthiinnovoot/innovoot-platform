# ADR-008: Component variant strategy (class-variance-authority)

**Status:** Accepted

## Context

Foundational components (`Button`, `Badge`, `Text`) need multiple visual variants (e.g.
`Button`'s `variant`/`size`) with type-safe props and a single place defining which Tailwind
classes each variant combination produces. Manual conditional class-string concatenation
(`variant === 'primary' ? 'bg-primary ...' : variant === 'secondary' ? ... `) doesn't scale
past a couple of variants and isn't type-checked against the actual variant names.

## Decision

Use `class-variance-authority` (cva) for any component with more than one visual variant.
Combined with `shared/utils/cn.ts` (`clsx` + `tailwind-merge`, already available from Phase 1)
for merging a `className` override on top of variant classes without class-order conflicts.

- **Why needed:** type-safe variant props (`VariantProps<typeof buttonVariants>`) derived
  directly from the variant definition — impossible to pass an invalid variant name and have it
  silently fail, unlike string-based conditionals.
- **Alternatives considered:** manual conditional classes (rejected — doesn't scale, no type
  safety); a custom in-house variant helper (rejected — cva already solves this well, and is a
  small, focused, dependency-free-at-runtime-of-its-own library, not worth reinventing).
- **Maintenance impact:** cva is widely used (the same library shadcn/ui is built on), stable
  API, no dependencies of its own.
- **Bundle impact:** ~1kb gzipped — negligible next to the ~97kb total gzipped bundle.

## Consequences

- Any future component with 2+ visual variants should follow the same `cva(...)` +
  `VariantProps` + `cn()` pattern established in `components/ui/Button.tsx` and
  `components/ui/Badge.tsx` — don't introduce a second variant-handling approach.
- Components with no variants (`Card`, `Input`) don't use cva — it's not justified for a
  single fixed style plus a `className` escape hatch. Don't add it preemptively.
