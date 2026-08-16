# components/forms

Composite form building blocks — FormField, form layout helpers, validated inputs wired to react-hook-form + zod. Generic across all modules' forms.

**Status:** not yet built (foundation stage only).

## Rule

Everything here must be reusable across unrelated modules with no import
from `modules/`. If a component needs to know about customers, orders, or
any other business domain, it belongs in that module's `components/`
folder instead — see docs/architecture/module-architecture.md.

Before adding a new component here, search `components/` and existing
modules for something close enough to extend — see the reusability rules
in `CLAUDE.md`.
