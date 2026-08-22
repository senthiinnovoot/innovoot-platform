STATUS: APPROVED
TYPE: PRODUCT / UX — INFORMATION ARCHITECTURE
SCOPE: PLATFORM-WIDE (Admin, OPS, Widget)

# INNOVOOT — INFORMATION ARCHITECTURE

Authoritative sources used: `PRODUCT_LANDSCAPE.md` (APPROVED), `PRODUCT_DEVELOPMENT_STRATEGY.md`, `PRODUCT_UX_PRINCIPLES.md` (APPROVED), `PLANNING_BASELINE.md`, `DATA_PRIVACY_PRINCIPLES.md` (APPROVED), `PRD-001-FORMS-LEAD-CAPTURE-V1.md`, `FORMS-V1-DATA-REQUIREMENTS.md`, `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md`. Legacy Admin and InnoForms documentation is evidence only.

---

## 1. Purpose

`PRODUCT_UX_PRINCIPLES.md` §9 deliberately stopped short of a complete IA: it fixed principles (navigation reflects tasks not tables, terminology, module boundaries, avoiding duplicate ownership) but explicitly deferred "the complete Innovoot IA" to a separate document. This is that document.

**Why platform-level IA has to come before feature-level UX:** Forms is APPROVED and IMPLEMENTATION READY at the PRD/data/API layer, but its Admin navigation placement was an open assumption (`PRD-001` §9, reaffirmed OPEN in `PRODUCT_UX_PRINCIPLES.md` §20 item 3) until this document closes it in §5. Healthcare Appointments is next in the roadmap and will introduce a second, larger set of IA questions (vertical modules, business/branch context at scale). Deciding Forms' navigation placement in isolation — or deciding it implicitly by how it gets built — would have locked in a structure before Healthcare exists to test it against. This document fixes the platform-level model once, so Forms, Healthcare, and future modules are placed _into_ a structure rather than each inventing one.

**Confirmed vs. recommended vs. open, throughout this document:**

- **CONFIRMED** = already decided in an APPROVED source, cited inline.
- **RECOMMENDATION** = this document's proposal, not yet a product decision — requires your approval.
- **OPEN** = a genuine unresolved question, listed in §19 and not silently resolved anywhere else in this document.

This document does not create screens, components, database schemas, or API contracts. It does not redesign the Base Kit's URL structure or authentication model. It does not design Forms-specific or Healthcare-specific UX beyond what is already PRD-confirmed.

---

## 2. Product Experience Architecture

**CONFIRMED** (`PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md` §2): three separate application experiences, not three skins of one app.

| Experience | Audience                                 | Responsibility                                                            | Trust / auth posture                                                                            |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Admin**  | Business/tenant administrators and staff | Configure and operate the tenant's business, across verticals             | Authenticated, tenant-scoped                                                                    |
| **OPS**    | Innovoot internal users                  | Manage tenant accounts, platform-wide configuration, cross-tenant support | Authenticated, internal, purpose-justified access to tenant data (`DATA_PRIVACY_PRINCIPLES` §6) |
| **Widget** | Public/end customers                     | Embedded and hosted public-facing experiences (forms, booking, etc.)      | Unauthenticated, tenant-context resolved per request                                            |

**Relationship between the three:** they are not required to mirror each other. A Core Platform Capability (e.g., Forms) is expected to have a presence in more than one experience — configured in Admin, consumed via Widget — but that does not mean every capability appears in every experience, and it does not mean OPS is "Admin with more permissions" (`PRODUCT_UX_PRINCIPLES.md` §6: "do not assume Admin-capability parity"). Whether a given capability needs an OPS presence at all is decided per capability, not assumed. Forms V1, for example, has **no OPS surface** — it's explicitly out of scope (`PRD-001` §33).

---

## 3. IA Model

**RECOMMENDATION** — proposed conceptual hierarchy:

```
Innovoot Platform
  → Experience            (Admin | OPS | Widget)
    → Business/Tenant Context   (Admin only — see §6)
      → Capability / Module     (e.g., Forms, Leads, Appointments)
        → Feature                (e.g., "publish a form", "update lead status")
          → Entity / Detail      (e.g., a specific Form, a specific Lead)
```

**Where this model is confirmed vs. recommended:**

- **CONFIRMED:** the top two levels (Experience; Business/Tenant Context within Admin) and the general principle that IA should reflect tasks, not data modeling (`PRODUCT_UX_PRINCIPLES.md` §9).
- **RECOMMENDATION:** the exact five-level nesting shown above, applied uniformly.

**This hierarchy does not apply uniformly to all three experiences**, and this document does not force it to:

- **Admin** fits the full hierarchy — it is tenant-scoped and module-organized.
- **OPS** has no per-tenant "current business" context the way Admin does (an OPS user works _across_ tenants); its hierarchy is Experience → Capability/Area → Entity, without a fixed Business/Tenant Context level (see §9).
- **Widget** is task-entry-point-driven, not navigation-driven at all — a visitor arrives already inside one capability (one Form, one booking flow) with no module list to browse (see §10).

---

## 4. Admin Information Architecture

**CONFIRMED starting model** (`PRODUCT_LANDSCAPE.md`): Common Platform Capabilities + Vertical-Specific Modules, for two initial verticals (Healthcare, Hospitality), all other verticals deferred.

### 4.1 Candidate navigation areas

| Area                                                                                              | Classification                           | Basis                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overview / Dashboard                                                                              | RECOMMENDATION                           | Base Kit already implements a `dashboard` route (`PLANNING_BASELINE.md` §4) as the landing page inside `/b/:businessId/branch/:branchId/`; a landing area is a near-universal Admin pattern, not a new capability. |
| Forms                                                                                             | CONFIRMED (module and nav placement)     | Module existence and scope: `PRD-001` (APPROVED). Nav placement: CONFIRMED as a sibling top-level item — see §5.                                                                                                   |
| Leads                                                                                             | CONFIRMED (module and nav placement)     | Same as Forms — see §5.                                                                                                                                                                                            |
| Appointments / Booking                                                                            | RECOGNIZED FUTURE CAPABILITY, not V1 nav | `PRODUCT_LANDSCAPE.md`: Booking/Appointments "is not to be designed yet." No screens exist. Do not add a placeholder nav item for it.                                                                              |
| Healthcare vertical area                                                                          | FUTURE MODULE                            | Second PRD in sequence, not yet planned (`PRODUCT_LANDSCAPE.md`). See §7.                                                                                                                                          |
| Hospitality vertical area                                                                         | FUTURE MODULE                            | Thin legacy evidence only, scope not yet decided (`PRODUCT_LANDSCAPE.md` Open Product Decision #3). See §7.                                                                                                        |
| Settings                                                                                          | RECOMMENDATION                           | Near-universal Admin pattern (business profile, branding, users) but **no PRD currently defines its content** — do not pre-populate it with speculative screens.                                                   |
| Website / Digital Marketing / Google Business Profile / Reviews / Competitor Analysis / Analytics | OPEN — do not add to nav                 | `PRODUCT_LANDSCAPE.md`: named in business vision, "no current PRD priority set." Adding nav for these now would be scope invented to fill navigation, which this document is instructed to avoid.                  |

**Why no full nav tree is finalized here:** Forms and Leads now have both confirmed product scope and a confirmed nav placement (sibling top-level items — see §5), but no other module does. Populating a "final" Admin nav for capabilities that don't have PRDs yet (Booking, Website, Marketing, Analytics, etc.) would itself be inventing product scope — exactly what this document is instructed not to do. §18 (IA Decisions) and §19 (Open Questions) track this explicitly rather than resolving it by drawing a nav tree that looks complete.

---

## 5. Forms vs. Leads

**CONFIRMED** (`PRD-001`, `PRODUCT_UX_PRINCIPLES.md` §9):

- Forms and Leads are distinct product modules — different user tasks, even though Leads currently has exactly one source (Forms).
- Forms creates Leads in V1.
- Leads is intended as a reusable platform concept, not a Forms sub-feature.

### 5.1 Options evaluated

| Option                                                          | Description                                                                                  | Assessment                                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Sibling top-level items**                                 | "Forms" and "Leads" each appear as their own top-level Admin nav entry                       | Matches their confirmed status as distinct modules; simplest mental model while Leads has one source; but two top-level items for what today looks like one workflow (fill a form → get a lead) may read as fragmented to a first-time user.          |
| **B — Shared parent grouping** (e.g., "Growth" or "Engagement") | Forms and Leads sit under one parent nav item                                                | Signals their relationship without collapsing them into one module; but invents a grouping label with no PRD basis, and pre-supposes what else might join that group later (risk of a parent category built for a membership that doesn't exist yet). |
| **C — Other structure**                                         | e.g., Leads surfaced contextually from within Forms rather than as independent top-level nav | Would violate the confirmed "Leads is reusable, not a Forms sub-feature" decision (`PRD-001`) — rejected.                                                                                                                                             |

### 5.2 Decision

**CONFIRMED: Option A — Forms and Leads are sibling top-level Admin navigation items.**

```
Admin
├── Overview
├── Forms
├── Leads
├── [future confirmed modules]
└── Settings
```

- **Reason:** They are confirmed distinct modules with distinct tasks (building/publishing a form vs. working a lead list), and `PRODUCT_UX_PRINCIPLES.md` §9 already establishes that IA presence should match product boundary, not data lineage. A single-source relationship today doesn't justify nesting one module inside the other's navigation.
- **Tradeoff (accepted):** If more Lead sources or more "growth-type" capabilities emerge later (per `PRODUCT_LANDSCAPE.md`'s deferred Website/Marketing/Reviews capabilities), a parent grouping (Option B) might become worth revisiting at that time. Choosing A now is not irreversible, but it is a bet against needing that grouping soon.

**This closes IA Open Question #1.** `PRD-001` §9 and `PRODUCT_UX_PRINCIPLES.md` §20 both previously flagged this as OPEN; it is now decided in this project and no longer appears in §19. **This decision is scoped to Forms and Leads only** — it does not finalize the rest of the Admin navigation (§4), which remains dependent on each future module's own approved product scope/PRD.

---

## 6. Business / Branch Context

**CURRENT BASE KIT EVIDENCE — NOT YET RATIFIED AS A PRODUCT IA DECISION** (`PLANNING_BASELINE.md` §8, §14, §16 — listed under "ASSUMED," not "CONFIRMED," in that document's own terms): the route pattern `/b/:businessId/branch/:branchId/...` exists and works, with the URL as the source of truth for current business/branch (no separate state store). `PLANNING_BASELINE.md` itself is explicit that this URL scheme is _implemented_ but not yet ratified as a _durable production_ structure via ADR. This document treats it the same way: current technical evidence, not a locked-in IA decision — and does not upgrade it to one.

### 6.1 UX/IA principles (not a URL redesign)

- **Current business/branch must always be visible and unambiguous** wherever it's relevant to the screen (`PRODUCT_UX_PRINCIPLES.md` §5) — CONFIRMED principle, generalized from the Base Kit's URL-is-source-of-truth mechanism.
- **Context should be carried, not re-selected.** Navigating between modules within the same business/branch should not force re-selection of that context (`PRODUCT_UX_PRINCIPLES.md` §9).
- **Switching business:** for a tenant with multiple businesses, there must be a clear, discoverable way to switch — **OPEN**, no confirmed mechanism exists (today's mock data models exactly one business).
- **Switching branch:** same principle, scoped one level down — **OPEN** for the same reason.
- **Single-business/single-branch tenants:** whether the business/branch chrome should collapse or hide itself when there's nothing to switch between is **OPEN** — not addressed in any approved source.

### 6.2 What's confirmed vs. open here

| Item                                                      | Status                                                                     |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| URL carries current business/branch as source of truth    | CURRENT BASE KIT EVIDENCE — NOT YET RATIFIED AS A PRODUCT IA DECISION      |
| Context must be visibly indicated at all relevant screens | CONFIRMED (`PRODUCT_UX_PRINCIPLES.md` §5)                                  |
| Exact switcher UI/interaction (dropdown, modal, etc.)     | OPEN — not designed here                                                   |
| Whether URL scheme is the final production structure      | OPEN per `PLANNING_BASELINE.md` itself — not redesigned or re-decided here |

---

## 7. Vertical Architecture

**CONFIRMED** (`PRODUCT_LANDSCAPE.md`): two initial verticals, Healthcare and Hospitality; all others deferred; Booking/Appointments intended as a reusable capability with vertical-specific behavior layered on top, "not to be designed yet."

### 7.1 Classification of vertical domain areas

| Domain area                                                          | Classification                              | Notes                                                                                                                                                                         |
| -------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Healthcare** (as a vertical)                                       | RECOGNIZED VERTICAL, not yet IA-designed    | Second PRD in the roadmap sequence (`PRODUCT_LANDSCAPE.md`); deepest legacy evidence (appointments, patients, doctors, queues, labs, pharmacies) exists but is evidence only. |
| Appointments (hospital/clinic)                                       | RECOGNIZED DOMAIN AREA                      | Target of the Healthcare PRD; layered on the not-yet-designed Booking/Appointments capability.                                                                                |
| Patients, doctors, queues, labs, pharmacies                          | RECOGNIZED DOMAIN AREA                      | Named in `PRODUCT_LANDSCAPE.md`'s Healthcare module table; none planned in navigation detail yet.                                                                             |
| **Hospitality** (as a vertical)                                      | RECOGNIZED VERTICAL, OPEN scope/timing      | `PRODUCT_LANDSCAPE.md` Open Product Decision #3: what scope, if any, Hospitality gets in the current cycle vs. being parked until Healthcare's flow is proven — unresolved.   |
| Rooms, properties, bookings                                          | RECOGNIZED DOMAIN AREA                      | Thin legacy evidence only; most scope is net-new.                                                                                                                             |
| Any other vertical (packers & movers, mehndi artists, schools, etc.) | FUTURE / DEFERRED — explicitly out of scope | `PRODUCT_LANDSCAPE.md`: "should not influence current capability design."                                                                                                     |

**No vertical module above is CONFIRMED VERTICAL NAVIGATION** — the Base Kit's placeholder routes (`patients`, `appointments`, `pharmacy`, `lab`, `rooms` behind `RequireModule`) are Base Kit scaffolding evidence (`PLANNING_BASELINE.md` §5, §16), not an approved IA. `PLANNING_BASELINE.md` itself states these render one shared placeholder page and that "no business module... has real UI."

### 7.2 IA extensibility principle

**RECOMMENDATION:** the Admin IA should treat "vertical module area" as a named slot in the hierarchy (Business/Tenant Context → _Vertical Module Area_ → Capability → Entity) whose _membership_ is populated per business type via the Base Kit's existing `enabled modules` mechanism (`PLANNING_BASELINE.md` §8), without this document defining what any specific vertical's modules are. This keeps the IA extensible to future verticals by construction, rather than by having to be redesigned each time a vertical is added.

---

## 8. Common Platform Capabilities

Mapped against `PRODUCT_LANDSCAPE.md`'s Core Platform Capabilities table:

| Capability                                 | IA status                                | Notes                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity & Multi-Tenant Account Management | FOUNDATIONAL, not a nav item             | Underlies business/branch context (§6) and auth; not itself a browsable module.                                                                                                    |
| Branding / Shared Design System            | RECOMMENDATION — lives under Settings    | No PRD defines a screen yet; likely Settings-area concern once Settings is scoped.                                                                                                 |
| Public Widget / SDK Runtime                | Not an Admin nav item                    | This is delivery infrastructure for Widget, not something Admin users browse directly.                                                                                             |
| **Forms & Lead Capture**                   | CONFIRMED module and nav placement       | Sibling top-level Admin item — see §5.                                                                                                                                             |
| **Leads**                                  | CONFIRMED module and nav placement       | Sibling top-level Admin item — see §5.                                                                                                                                             |
| Booking / Appointments                     | RECOGNIZED FUTURE CAPABILITY, no nav yet | `PRODUCT_LANDSCAPE.md`: "not to be designed yet." No placeholder should be added.                                                                                                  |
| Website / Digital Presence                 | OPEN — no nav                            | "No current PRD priority set."                                                                                                                                                     |
| Digital Marketing                          | OPEN — no nav                            | Same.                                                                                                                                                                              |
| Google Business Profile Management         | OPEN — no nav                            | Same.                                                                                                                                                                              |
| Review Management                          | OPEN — no nav                            | Same.                                                                                                                                                                              |
| Competitor Analysis                        | OPEN — no nav                            | Same.                                                                                                                                                                              |
| Analytics / Insights                       | OPEN — no nav                            | `PRODUCT_LANDSCAPE.md`: scope (tenant/OPS/widget-level) not yet decided; `PRD-001` §34 separately defers Forms-specific analytics. Do not add an Analytics nav item pre-emptively. |
| Chat                                       | OUT OF CURRENT SCOPE                     | `PRODUCT_LANDSCAPE.md`: "remain outside current confirmed scope until explicitly decided."                                                                                         |
| Billing                                    | OUT OF CURRENT SCOPE                     | Same.                                                                                                                                                                              |

No deferred capability is promoted into active navigation in this document — each stays exactly as evidenced in `PRODUCT_LANDSCAPE.md`.

---

## 9. OPS Information Architecture

**CONFIRMED responsibility** (`PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md` §6): tenant account management, platform-wide configuration, cross-tenant support — with a hard constraint that OPS access to tenant personal data must be purpose-justified and auditable (`DATA_PRIVACY_PRINCIPLES.md` §6), not general browsing.

| Candidate area                         | Classification              | Notes                                                                                                                                                                                                           |
| -------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenants / Businesses (list, detail)    | RECOMMENDATION              | Directly implied by "manage tenant accounts" — but no PRD currently specifies what an OPS tenant-detail screen contains.                                                                                        |
| Platform configuration                 | RECOMMENDATION              | Implied by "platform-wide configuration" in `PRODUCT_LANDSCAPE.md`; content undefined.                                                                                                                          |
| Support / cross-tenant support tooling | RECOMMENDATION              | Implied by "support" responsibility; must respect the purpose-justified/auditable access constraint (`DATA_PRIVACY_PRINCIPLES.md` §6) in whatever form it takes — this document does not design that mechanism. |
| Monitoring / platform operations       | OPEN                        | Not named in any approved source as OPS scope; do not add without evidence.                                                                                                                                     |
| Forms/Leads OPS support surface        | EXPLICITLY DEFERRED, not V1 | `PRD-001` §33 lists this as a future consideration, not current scope — do not add.                                                                                                                             |

**Explicitly not done here:** OPS navigation is not a copy of Admin navigation with more permissions (`PRODUCT_UX_PRINCIPLES.md` §6). OPS has no equivalent of Admin's per-tenant Business/Tenant Context level in the IA model (§3) — an OPS user's default frame is cross-tenant, narrowing to one tenant only when a specific support/account task requires it.

---

## 10. Widget / Public IA

Widget is task-oriented, not navigation-oriented — a visitor never browses a module list; they arrive already inside one task (fill a form, in future, make a booking).

**CONFIRMED behavioral baseline for the one existing public capability, Forms** (`PRD-001` §11–§12, `PRODUCT_UX_PRINCIPLES.md` §7):

- No Innovoot chrome/branding beyond what the capability requires — it should not read as a leaked piece of Admin.
- Mobile-first; minimal required input.
- Both embedded (inline, in-page) and Innovoot-hosted (standalone, shareable-link) surfaces exist for the same capability, with equivalent behavior.

### 10.1 State principles (capability-agnostic, not Forms-specific wording)

| State       | Principle                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task entry  | The visitor lands directly in the task (the rendered form / the rendered booking flow) with no intermediate navigation.                                                               |
| Success     | Unambiguous confirmation that the action completed — never inferred, never silent (`PRD-001` §21 precedent, generalized as a principle).                                              |
| Error       | Clear, actionable feedback; already-entered valid input is preserved, never discarded (`PRD-001` §21 precedent).                                                                      |
| Unavailable | A capability that's no longer active (e.g., an unpublished form) shows an explicit "no longer available" state rather than a broken page or silent failure (`PRD-001` §19 precedent). |

This section generalizes Forms' confirmed public-surface behavior into platform-level principles, per `PRODUCT_UX_PRINCIPLES.md`'s own recommendation to do so (§ "Recommended UX Principles"). It does not invent new Widget capabilities beyond Forms, and it does not design a page hierarchy for Booking or any other future public capability.

---

## 11. Navigation Principles

Following `PRODUCT_UX_PRINCIPLES.md` §9:

- **Primary navigation** reflects modules a user acts within (task-oriented), not database tables.
- **Contextual navigation** (business/branch, §6) is carried across module changes, not re-selected per screen.
- **Breadcrumbs:** RECOMMENDATION — retained as legacy UX evidence worth carrying forward (`PRD-001` "Legacy UX evidence note"), useful wherever entity/detail nesting exists (§13); not mandated for every screen.
- **Entity/detail navigation:** list → detail is the consistent platform pattern (`PRODUCT_UX_PRINCIPLES.md` §5, §9).
- **Back navigation:** should return to the originating list/context, not an arbitrary default.
- **Cross-module navigation:** where one module's record references another (e.g., a Lead referencing its source Form), IA supports _linking to_ the related record, not nesting ownership of it (`PRODUCT_UX_PRINCIPLES.md` §9) — e.g., a Lead's detail view can link to its source Form without Forms owning Lead data.
- **Avoiding duplicate entry points:** a given task should have one clear home in the nav, not multiple competing paths to the same action.
- **Preserving user context:** actions taken from a list (e.g., updating a Lead's status) should not force loss of list position/filters.
- **Avoiding navigation overload:** per §4, nav items are added only for modules with confirmed product scope — not one per database entity or one per named-but-undesigned future capability.

---

## 12. Module Boundaries

**CONFIRMED** (`PRD-001`, `PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md` §9):

- Forms ≠ Leads — distinct modules, distinct tasks.
- Leads is a reusable platform concept (single source today, designed to accept more later).
- Booking/Appointments is intended to become reusable, with vertical-specific behavior layered on top — not yet designed.
- Healthcare-specific behavior (e.g., clinical notes, queue management) sits _above or alongside_ reusable capabilities (e.g., the future Booking/Appointments capability), not forked from them — this is the same relationship Forms has to Leads, generalized.
- Hospitality-specific behavior should follow the same layering model once it is scoped.

**IA representation principle (RECOMMENDATION):** a reusable capability (Forms, Leads, and in future Booking/Appointments) keeps one IA home regardless of which vertical is using it; a vertical module's IA presence is the vertical-specific layer on top, not a duplicate of the reusable capability's screens. This mirrors the legacy risk explicitly flagged in `PRODUCT_LANDSCAPE.md` (two legacy components independently mutating the same queue data) — module boundaries in the IA should make single ownership visible, not just assumed.

No technical module implementation (folder structure, service boundaries) is defined here — that is `PLANNING_BASELINE.md`'s domain.

---

## 13. Entity / Detail Relationships

At IA level only — no database relationships:

```
Business
  → Branch
    → Module (e.g., Forms, Leads)
      → Entity (e.g., a Form, a Lead)
        → Detail (full record + actions)
```

Confirmed examples from Forms (`PRD-001` §28, `FORMS-V1-DATA-REQUIREMENTS.md` §2):

- **Form → Form Detail** (metadata, fields, publish state, embed/hosted artifacts)
- **Lead → Lead Detail** (submitted data, source Form reference, status, timestamp)

Note the confirmed conceptual distinction Form ≠ Submission ≠ Lead (`FORMS-V1-DATA-REQUIREMENTS.md` §2) — a Lead's detail view links to its source Form (per §11's cross-module linking principle) rather than embedding full Form-editing ownership inside Leads.

This pattern is expected to generalize to future entities (e.g., Appointment → Appointment Detail) without this document defining those entities now.

---

## 14. Search / Filter / List Principles

Platform-level principles only:

- Every module exposing multiple records follows the confirmed list → detail pattern (§11, §13).
- Lists support filtering by the attributes most relevant to triage for that module — e.g., Leads filterable by source Form is already confirmed scope (`PRD-001` §10: "list of leads (filterable by source form)").
- Empty, loading, and error states are explicitly defined per list-bearing screen, distinguishing meaningfully different empty states (e.g., "no forms published yet" vs. "forms published, no submissions yet") rather than one generic empty state (`PRODUCT_UX_PRINCIPLES.md` §5, citing `PRD-001` §27).
- Free-text search is **not currently implemented anywhere in the Base Kit** (`PLANNING_BASELINE.md` §15: "the mock engine has no free-text search/filter") — this document does not assume search exists; whether/where it's needed per module is a feature-level UX decision, not decided here.

Detailed component behavior (pagination, sort-column mechanics, filter UI) is out of scope for this document.

---

## 15. Responsive IA

- **Desktop Admin:** primary target — RECOMMENDATION only, not confirmed anywhere (`PRODUCT_UX_PRINCIPLES.md` §20 item 2 lists this as explicitly open).
- **Tablet Admin:** RECOMMENDATION, secondary target, no confirmed policy.
- **Mobile Admin:** OPEN — no confirmed support level; Admin's device/responsive support policy is an explicit open item (`PRODUCT_UX_PRINCIPLES.md` §20).
- **Public Widget/mobile:** CONFIRMED mobile-first (`PRODUCT_UX_PRINCIPLES.md` §7) — the one clear, sourced responsive commitment in the platform today.

No exact breakpoints are defined here — that belongs to the design-token/design-system layer (`PLANNING_BASELINE.md` §9), not this document.

---

## 16. Terminology

**CONFIRMED** (`PRODUCT_UX_PRINCIPLES.md` §17):

| Term     | Usage                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Tenant   | Platform-level/internal concept — tenant administrators, tenant isolation, tenant branding               |
| Business | The tenant's operating business entity within Admin (Base Kit: `Business` type)                          |
| Branch   | A location/branch under a Business (Base Kit: `Branch` type)                                             |
| Admin    | The authenticated, tenant-scoped experience                                                              |
| OPS      | The internal Innovoot experience                                                                         |
| Widget   | The public/embedded/hosted experience                                                                    |
| Forms    | The module name (not "Forms & Leads," not merged with Leads)                                             |
| Leads    | The module name — explicitly **not** "Leads & CRM" (rejected legacy terminology, `PRD-001` decision #16) |

**Do not use:** "Leads & CRM."

**OPEN terminology:** the label for any future Admin nav grouping (see §5, Option B) is not fixed — if a shared-parent structure is ever adopted, its name is undecided and should not be assumed to be "Growth" or "Engagement" (used only as illustrative examples in §5).

---

## 17. Legacy IA Evidence

### USEFUL LEGACY EVIDENCE

- Field-builder interaction pattern (type dropdown, required toggle, reorder, duplicate/delete) — retained as evidence for later Forms UX design (`PRD-001` legacy note).
- Live preview alongside editing — same source.
- Embed-code presentation pattern — same source.
- Breadcrumb navigation — same source, informs §11.
- Healthcare's relative evidence depth (appointments, doctors, locations, token/MR queues, prescriptions, notes) — useful reference for the Healthcare PRD, not a specification (`PRODUCT_LANDSCAPE.md`).
- The documented legacy risk of duplicate queue-data ownership (`HCQueueControl` vs. `HCVisitsTimeline`/`MRQueueDrawer`) — informs §12's module-boundary principle, as a caution, not a pattern to repeat.

### DO NOT CARRY FORWARD

- Legacy Admin/InnoForms overall navigation structure or IA.
- Legacy "Form Mode: Single/Multiple" toggle and template-selection architecture.
- Legacy pricing tiers and paywalled comparison tables (monetization).
- "Leads & CRM" terminology.
- Any assumption that a legacy screen's existence justifies a new-platform screen — legacy is evidence of what was attempted, not a specification (per the project's Authority Rule).

---

## 18. IA Decisions

### CONFIRMED IA DECISIONS

- Three separate experiences: Admin, OPS, Widget (§2).
- Common Platform Capabilities + Vertical-Specific Modules as the underlying model (§2, §7, §8).
- Forms and Leads are distinct product modules; Leads is reusable, not a Forms sub-feature (§5).
- **Forms and Leads are sibling top-level Admin navigation items** (§5) — closes IA Open Question #1. This does not finalize the rest of Admin navigation, which remains dependent on each future module's own approved scope/PRD.
- Current business/branch context must be visibly indicated wherever relevant (§6) — this UX principle is confirmed even though the underlying URL-sourcing mechanism itself is Base Kit evidence, not yet a ratified IA decision (see below).
- List → detail is the platform-wide pattern for record-bearing modules (§11, §13).
- Terminology: Tenant, Business, Branch, Admin, OPS, Widget, Forms, Leads — "Leads," never "Leads & CRM" (§16).
- Widget is mobile-first with no Admin-chrome leakage (§10).
- Booking/Appointments, Website, Marketing, GBP, Reviews, Competitor Analysis, Analytics, Chat, and Billing all remain outside active V1 navigation — none has confirmed IA presence (§8).

### RECOMMENDED IA DECISIONS

- IA model: Experience → Business/Tenant Context → Capability/Module → Feature → Entity/Detail, applied to Admin only, not forced onto OPS or Widget (§3).
- Vertical module area as an extensible, per-business-type "slot" in the Admin IA rather than a hardcoded Healthcare/Hospitality tree (§7.2).
- Reusable capabilities keep one IA home regardless of which vertical uses them; vertical modules layer on top (§12).
- Desktop/tablet as Admin's primary responsive targets (§15) — flagged open elsewhere, repeated here as a recommendation only.
- Breadcrumbs as a recommended (not mandatory-everywhere) navigation aid (§11).
- The `/b/:businessId/branch/:branchId/` URL scheme continuing to serve as the source of truth for business/branch context — recommended to carry forward as-is, but still Base Kit evidence pending its own ratification, not re-decided here (§6).

### OPEN IA DECISIONS

See §19 for the complete list.

---

## 19. IA Open Questions

~~1. Forms vs. Leads navigation grouping~~ — **CLOSED.** Confirmed in §5: Forms and Leads are sibling top-level Admin navigation items.

1. **Final Admin navigation structure** beyond Forms/Leads — cannot be finalized until Settings, Booking/Appointments, and vertical modules have their own PRDs (§4, §8).
2. **Final OPS navigation structure** — tenant management, platform configuration, and support areas are recommended but undefined in content (§9).
3. **Business/branch switching model** — no confirmed switcher mechanism exists for multi-business or multi-branch tenants (§6).
4. **Future vertical navigation strategy** — how Healthcare and (if scoped) Hospitality modules populate the "vertical module area" slot is recognized in principle (§7.2) but not designed.
5. Whether the `/b/:businessId/branch/:branchId/` URL scheme is ratified as the durable production structure, or subject to future ADR-level change — inherited as open from `PLANNING_BASELINE.md` itself, not resolved here (§6).
6. Timing/scope of Hospitality relative to Healthcare (`PRODUCT_LANDSCAPE.md` Open Product Decision #3) — affects when/whether a Hospitality vertical area is needed in Admin IA at all.
7. Formal accessibility conformance target and Admin's device/responsive support policy — carried forward unresolved from `PRODUCT_UX_PRINCIPLES.md` §20.

This document does not reopen any already-approved Forms product decision (`PRD-001`, Data Requirements, API/Behavioral Requirements) — none of the above touches Forms' confirmed scope. The Forms/Leads navigation placement decision (§5) is itself now closed, not open; it does not reopen or alter any Forms PRD content.

---

## 20. Traceability

| IA element                                                   | Source                                                                              | Status                                                                |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Three experiences (Admin/OPS/Widget)                         | `PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md` §2                               | CONFIRMED                                                             |
| Common Platform + Vertical Modules model                     | `PRODUCT_LANDSCAPE.md`                                                              | CONFIRMED                                                             |
| Forms ≠ Leads; Leads reusable                                | `PRD-001`, `PRODUCT_UX_PRINCIPLES.md` §9                                            | CONFIRMED                                                             |
| Forms/Leads nav placement                                    | `PRD-001` §9, `PRODUCT_UX_PRINCIPLES.md` §20 item 3; decided in §5 of this document | CONFIRMED (closed here — sibling top-level items)                     |
| Business/branch URL-as-source-of-truth                       | `PLANNING_BASELINE.md` §8, §14                                                      | CURRENT BASE KIT EVIDENCE — NOT YET RATIFIED AS A PRODUCT IA DECISION |
| Business/branch visibility principle                         | `PRODUCT_UX_PRINCIPLES.md` §5                                                       | CONFIRMED                                                             |
| Booking/Appointments not yet designed                        | `PRODUCT_LANDSCAPE.md`                                                              | CONFIRMED                                                             |
| Healthcare/Hospitality as initial verticals, others deferred | `PRODUCT_LANDSCAPE.md`                                                              | CONFIRMED                                                             |
| OPS purpose-justified/auditable access                       | `DATA_PRIVACY_PRINCIPLES.md` §6                                                     | CONFIRMED                                                             |
| List/detail, empty-state, cross-module-linking principles    | `PRODUCT_UX_PRINCIPLES.md` §5, §9                                                   | CONFIRMED                                                             |
| Terminology ("Leads," not "Leads & CRM"; Tenant)             | `PRODUCT_UX_PRINCIPLES.md` §17                                                      | CONFIRMED                                                             |
| Widget mobile-first, no Admin-chrome leakage                 | `PRODUCT_UX_PRINCIPLES.md` §7                                                       | CONFIRMED                                                             |
| Responsive Admin target (desktop/tablet)                     | Not sourced                                                                         | RECOMMENDATION only                                                   |
| Base Kit routing tree / placeholder modules                  | `PLANNING_BASELINE.md` §5                                                           | CONFIRMED as evidence, not as IA                                      |

---

## 21. Consistency Check

Verified this document does **not** introduce:

- ❌ New product scope — no capability beyond what `PRODUCT_LANDSCAPE.md` already names is proposed.
- ❌ CRM/pipeline functionality — Leads terminology and boundaries unchanged from `PRD-001`/`PRODUCT_UX_PRINCIPLES.md`.
- ❌ Analytics as an active V1 module — explicitly kept OPEN/no-nav in §8.
- ❌ Unapproved verticals — only Healthcare and Hospitality referenced, both classified as recognized-not-designed (§7).
- ❌ Legacy monetization or legacy navigation — explicitly excluded (§17).
- ❌ Per-form branding — not addressed; no change to `PRD-001` §20's tenant-level-only branding.
- ❌ API/database architecture — none defined anywhere in this document.
- ❌ Base Kit redesign — the URL scheme and routing tree are treated as current evidence, not redesigned (§6, §7.1).

No contradictions found against `PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md`, `PLANNING_BASELINE.md`, `DATA_PRIVACY_PRINCIPLES.md`, or the approved Forms artifacts.

---

# FINAL SUMMARY

### CONFIRMED IA

- Admin, OPS, Widget as three distinct experiences with distinct audiences/trust postures.
- Common Platform Capabilities + Vertical-Specific Modules, for Healthcare and Hospitality initially.
- Forms and Leads are distinct, confirmed modules; Leads is reusable.
- **Forms and Leads are confirmed as sibling top-level Admin navigation items** (§5) — closes IA Open Question #1. The rest of Admin navigation remains open, pending each future module's own approved scope/PRD.
- Current business/branch context must always be visibly indicated in Admin — a confirmed UX principle, independent of the fact that its underlying URL-sourcing mechanism remains current Base Kit evidence, not yet a ratified product IA decision (§6).
- List → detail as the platform-wide record pattern; cross-module references link rather than nest ownership.
- Confirmed terminology: Tenant, Business, Branch, Admin, OPS, Widget, Forms, Leads ("Leads," never "Leads & CRM").
- Widget is mobile-first with no Admin-chrome leakage; success/error/unavailable states are always explicit.
- No nav presence yet for Booking/Appointments, Website, Marketing, GBP, Reviews, Competitor Analysis, Analytics, Chat, or Billing.

### RECOMMENDED IA

- Five-level IA model (Experience → Business/Tenant Context → Capability → Feature → Entity/Detail) for Admin only.
- Extensible "vertical module area" slot in Admin IA, populated per business type, not hardcoded per vertical.
- Reusable capabilities keep one IA home across verticals; vertical modules layer on top.
- Desktop/tablet-first Admin responsive target; breadcrumbs as a recommended navigation aid.
- The `/b/:businessId/branch/:branchId/` URL scheme continuing as the business/branch source of truth — recommended to keep, but still Base Kit evidence pending its own ratification.

### OPEN IA DECISIONS

1. Complete final Admin nav beyond Forms/Leads (blocked on Settings, Booking, and vertical PRDs).
2. Complete final OPS nav content.
3. Business/branch switching UI mechanism.
4. Future vertical navigation population strategy.
5. Ratification of the `/b/:businessId/branch/:branchId/` URL scheme as a durable production structure.
6. Hospitality timing/scope relative to Healthcare.
7. Accessibility conformance target; Admin responsive/device policy.

### EXPERIENCE MAP

```
Innovoot Platform
├── Admin (tenant-scoped, authenticated)
│   └── Business/Branch Context
│       ├── Overview/Dashboard [RECOMMENDATION]
│       ├── Forms [CONFIRMED module and nav placement]
│       ├── Leads [CONFIRMED module and nav placement]
│       ├── Vertical Module Area [slot — RECOMMENDATION, empty until Healthcare/Hospitality PRDs land]
│       └── Settings [RECOMMENDATION, content undefined]
├── OPS (internal, cross-tenant, purpose-justified access)
│   ├── Tenants/Businesses [RECOMMENDATION]
│   ├── Platform Configuration [RECOMMENDATION]
│   └── Support [RECOMMENDATION]
└── Widget (public, unauthenticated, task-entry)
    └── Task (e.g., a rendered Form) → Success / Error / Unavailable
```

### NAVIGATION MAP

Admin: task-oriented top-level modules, business/branch context always visible and carried across navigation, list→detail within each module, cross-module linking (not nesting) for related records (e.g., Lead → source Form).
OPS: cross-tenant by default, narrowing to one tenant only for a specific task; not a mirror of Admin nav.
Widget: no navigation in the traditional sense — one task per entry point, with explicit success/error/unavailable states.

### MODULE RELATIONSHIPS

Forms and Leads: sibling modules, Forms produces Leads, Leads remains open to future sources. Booking/Appointments: future reusable capability, not yet designed, will sit alongside Forms/Leads as a peer Core Platform Capability once scoped. Vertical modules (Healthcare, Hospitality): layer vertical-specific behavior on top of reusable capabilities rather than forking them — the same relationship Forms already has to Leads.

### TRACEABILITY

See §20 — every element traced to its source document and CONFIRMED/RECOMMENDATION/OPEN status.

### CONSISTENCY CHECK

No new product scope, CRM functionality, active-V1 analytics, unapproved verticals, legacy monetization/navigation, per-form branding, API/database architecture, or Base Kit redesign introduced. See §21.

### RECOMMENDED NEXT STEP

With Forms/Leads navigation placement now confirmed, prepare the Claude Code implementation handoff for Forms' and Leads' Admin screens (list → detail, per §11/§13), scoped strictly to what `PRD-001`, the Data Requirements, and the API/Behavioral Requirements already approve — without extending into any of the still-open Admin nav items (§19).
