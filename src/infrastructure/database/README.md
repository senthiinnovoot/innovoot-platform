# infrastructure/database

Database client/connection and query layer. Not wired up yet — this project is frontend-only for now (see docs/decisions ADR on backend scope).

**Status:** stub. This project is currently frontend-only (Phase 1 decision).
This folder exists so the dependency direction and integration point are
already defined — modules and shared/ code should depend on an interface
here, never on a specific vendor SDK directly — so wiring in a real backend
later doesn't require touching module code. See docs/decisions/ for the
ADR recording this choice.
