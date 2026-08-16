# components/data-display

Generic data-presentation primitives — StatCard, EmptyState, Skeleton, Badge groups, Tag.

**Status:** not yet built (foundation stage only).

## Rule

Everything here must be reusable across unrelated modules with no import
from `modules/`. If a component needs to know about customers, orders, or
any other business domain, it belongs in that module's `components/`
folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing
modules for something close enough to extend — see the reusability rules
in `CLAUDE.md`.
