# Design System — Tokens

**Status:** implemented (Phase 2). This document describes the actual token system in
`src/index.css`, not a plan — see `docs/decisions/ADR-007-theming-architecture.md` for the
architectural reasoning behind the choices made here.

## Source of truth

All tokens are defined exactly once, as CSS custom properties in `src/index.css`:

- Color, shadow, and radius-base values live in `:root` (light theme) and `.dark` (dark theme) —
  identical variable names, different values per theme. Nothing else defines a duplicate copy.
- `@theme inline { ... }` maps those variables into Tailwind v4's namespaces (`--color-*`,
  `--radius-*`, `--shadow-*`, `--text-*`, `--font-*`), which is what makes utilities like
  `bg-primary`, `rounded-lg`, `shadow-md`, and `text-heading-lg` exist at all. Tailwind generates
  the utility classes from these `@theme` declarations — there is no `tailwind.config.js` token
  object to keep in sync (Tailwind v4 is CSS-first).
- There is no parallel TypeScript token object. Anything that needs a token value in JS (rare —
  e.g. a canvas/chart color) should read it via `getComputedStyle` against the CSS variable, not
  redefine the value.

This means adding or changing a token touches exactly one file, in at most two places (`:root`
and `.dark`).

## Color

Semantic, not component-specific — components reference `primary`, `surface`, `border`, never a
raw palette name or hex value. Defined in the OKLCH color space (perceptually uniform, Tailwind
v4's recommended format), one value per theme:

| Token                                                                    | Purpose                                                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `background` / `foreground`                                              | Page-level base background and text color.                                                                              |
| `surface` / `surface-elevated`                                           | Card/panel backgrounds; `elevated` for content that sits above `surface` (e.g. a popover).                              |
| `primary` / `primary-foreground`                                         | Primary brand/action color and the text/icon color that's readable on it.                                               |
| `secondary` / `secondary-foreground`                                     | Secondary actions/surfaces, lower emphasis than primary.                                                                |
| `accent` / `accent-foreground`                                           | A distinct highlight color, separate from `primary`.                                                                    |
| `muted` / `muted-foreground`                                             | De-emphasized backgrounds and text (hints, disabled-adjacent copy).                                                     |
| `border` / `input`                                                       | Default border color; `input` for form-control borders (may diverge from `border` later, kept separate now on purpose). |
| `ring`                                                                   | Focus ring color — currently aliased to `primary`.                                                                      |
| `success` / `warning` / `error` / `info`, each with a `-foreground` pair | Status colors, each with a text/icon color that's readable on it.                                                       |

Every text-on-background and text-on-surface pairing above (11 pairs per theme, plus the focus
ring against both `background` and `surface`) is checked for WCAG AA contrast automatically — see
[Verification](#verification) below. This is enforced, not just documented, specifically because
color values are easy to "tune" during design work in a way that silently breaks contrast.

## Typography

One type scale, defined as paired `--text-*` / `--text-*--line-height` / `--text-*--letter-spacing`
Tailwind v4 variables, generating a matching `text-*` utility for each:

`display-lg`, `display-md`, `display-sm`, `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`,
`body-lg`, `body-md`, `body-sm`, `caption`, `label`.

The `Text` component (`components/ui/Text.tsx`) wraps this scale with a sensible default HTML
element per variant (e.g. `display-lg` → `h1`, `body-md` → `p`, `label` → `span`), overridable via
an explicit `as` prop so visual style and semantic element can be chosen independently (e.g. a
`heading-sm`-styled `<h2>` inside a page that already used `heading-lg` for its `<h1>`).

`--font-sans` and `--font-mono` are the only font-family tokens — system font stacks, no webfont
loaded this phase (not required by the brief; revisit if brand typography is specified later).

## Spacing

No custom spacing scale was introduced. Tailwind v4's built-in spacing scale (derived from a
single `--spacing` base variable) is used as-is — it is already a predictable, systematic scale,
and the brief's requirement ("predictable scale, no arbitrary values without a documented reason")
is satisfied by using it consistently rather than replacing it. Arbitrary spacing values
(`p-[17px]`) remain disallowed — see `CLAUDE.md` §7.

## Border radius

A single `--radius-base` variable drives four derived tokens, so the whole scale can be
tuned (e.g. for a rounder or sharper brand feel) by changing one value:

| Token       | Formula                  |
| ----------- | ------------------------ |
| `radius-sm` | `radius-base - 4px`      |
| `radius-md` | `radius-base - 2px`      |
| `radius-lg` | `radius-base` (0.625rem) |
| `radius-xl` | `radius-base + 4px`      |

Full-pill radius uses Tailwind's built-in `rounded-full`, not a custom token — no need to
duplicate what already exists.

## Shadows

Four elevation steps (`shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`), each a layered
box-shadow value tuned per theme (dark theme uses higher-opacity shadows, since a subtle shadow
that reads clearly on a light background is nearly invisible on a dark one). Deliberately kept to
four steps rather than Tailwind's larger default shadow scale, per the brief's "small controlled
scale" requirement.

## Z-index

No Tailwind `@theme` namespace exists for z-index, so this is a set of plain `@layer utilities`
classes rather than `@theme` tokens:

`z-base`, `z-dropdown`, `z-sticky`, `z-overlay`, `z-modal`, `z-toast`, `z-tooltip` — each a fixed
value with enough headroom between steps (1000, 1020, 1030, 1040, 1050, 1060) to insert a new
layer later without renumbering everything.

## Motion

- `--ease-*` tokens are provided by Tailwind v4's defaults and used as-is (`ease-in-out`, etc.) —
  no custom easing curve was required this phase.
- A global `@media (prefers-reduced-motion: reduce)` rule collapses all animation/transition
  durations to effectively zero and disables smooth scrolling, so `prefers-reduced-motion` is
  respected automatically without every component needing to check it individually.
- No custom `--duration-*` tokens were introduced — Tailwind's default numeric duration utilities
  (`duration-150`, `duration-200`, ...) are used directly, consistent with the spacing scale
  decision above (use the systematic default rather than inventing a parallel scale without a
  concrete need).

## Icons

`lucide-react` is used directly for now (e.g. `Sun`/`Moon` in `ThemeToggle`). A
`design-system/icons/` wrapper is planned per the Phase 1 strategy but was not required to
validate the design system this phase, since only two icons are in use — revisit once icon usage
grows enough to justify the indirection (see CLAUDE.md §16, "don't over-engineer").

## Rule

```text
Avoid:  color: #123456;         padding: 17px;        border-radius: 13px;
        className="bg-[#123456]"  className="p-[17px]"  className="rounded-[13px]"
Prefer: className="bg-primary"  className="p-4"       className="rounded-md"
```

No raw hex/px/arbitrary Tailwind values in module or component code — see `CLAUDE.md` §7. This is
currently enforced by documentation and code review, not an automated lint rule — see
`docs/decisions/ADR-009-deferred-arbitrary-value-lint.md` for why, and when to revisit.

## Theming

Light and dark themes are both defined in `src/index.css` (`:root` / `.dark`) using identical
variable names, switched by toggling a `.dark` class on `<html>`. Components never branch on
`theme === 'dark'` — they reference semantic tokens (`bg-background`, `text-foreground`), which
resolve differently depending on which theme's block is active. See
`docs/decisions/ADR-007-theming-architecture.md` for the full architecture, including the
class-based-vs-`prefers-color-scheme` decision, where `ThemeProvider` lives and why, and a real
bug this design intentionally closes off.

## Verification

`tests/unit/design-system-tokens.test.ts` reads `src/index.css` directly (not a hand-copied
duplicate of the values) and checks WCAG AA contrast for every semantic text/background pairing in
both themes, plus focus-ring visibility, using `culori`'s `wcagContrast()`. This runs as part of
`pnpm test`, so a future token change that breaks contrast fails the test suite rather than being
caught only by eye.

The `src/app/routes/design-system` route (dev-only, excluded from production builds via
`import.meta.env.DEV`) renders every token and foundational component for visual/manual
verification — colors, type scale, spacing, radius, shadows, and light/dark switching. It is a
validation tool, not a product page.
