# Folder Structure

```text
innovoot/
│
├── CLAUDE.md                  # Permanent development rules — read before making changes
├── README.md
├── package.json
├── eslint.config.js           # Includes module-boundary enforcement (see dependency-rules.md)
├── vite.config.ts             # Path aliases, Tailwind plugin, Vitest config
├── tsconfig*.json
├── playwright.config.ts
│
├── src/
│   ├── app/                   # Composition root — see below
│   │   ├── routes/
│   │   ├── layouts/
│   │   ├── providers/
│   │   └── config/
│   │
│   ├── modules/                # One folder per business domain
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── appointments/
│   │   ├── services/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── marketing/
│   │   ├── seo/
│   │   └── settings/
│   │
│   ├── components/             # Generic, reusable UI (see module-architecture.md)
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── cards/
│   │   ├── navigation/
│   │   ├── feedback/
│   │   └── data-display/
│   │
│   ├── shared/                 # Generic, reusable logic
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── types/
│   │   └── validation/
│   │
│   ├── design-system/          # Tokens, theming — the foundation layer
│   │   ├── tokens/
│   │   ├── typography/
│   │   ├── icons/
│   │   ├── themes/
│   │   └── documentation/
│   │
│   ├── infrastructure/         # Backend/vendor integration points (currently stubs)
│   │   ├── database/
│   │   ├── authentication/
│   │   ├── storage/
│   │   ├── logging/
│   │   └── monitoring/
│   │
│   ├── main.tsx
│   └── index.css
│
├── docs/
│   ├── architecture/
│   ├── design-system/
│   ├── modules/                 # Per-module docs, populated as modules are built
│   ├── api/                     # API contracts, populated once a backend exists
│   └── decisions/                # ADRs
│
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    └── setup.ts
```

## Deliberate deviation from the illustrative tree in the original brief

The originating brief's example tree places `app/`, `modules/`, `components/`, `shared/`,
`design-system/`, and `infrastructure/` at the repository root. This project nests them under
`src/` instead, because:

- Vite (and essentially every modern SPA toolchain) expects application source under `src/`,
  with `index.html` and config files at the repo root — fighting that convention buys nothing.
- It keeps a clean separation between "things the build tool touches" (`src/`, `public/`,
  config files) and "things about the project as a whole" (`docs/`, `tests/`, `CLAUDE.md`).

This is flagged explicitly per `CLAUDE.md`'s instruction to surface architecture deviations
rather than applying them silently. If this direction changes for a specific reason, revisit in
a new ADR — do not move folders without updating this document and `dependency-rules.md`'s
patterns.

## Why `README.md` in every currently-empty folder

Git does not track empty directories, and a genuinely empty folder gives an AI agent or new
developer zero signal about what belongs there. Every module and component category folder
therefore has a `README.md` stating its purpose, its planned internal structure, and the
dependency rule that applies to it — see `CLAUDE.md` §15 (AI-assisted development: predictable
folder names, documented conventions, minimal hidden behavior).
