STATUS: APPROVED
TYPE: PRODUCT / UX GOVERNANCE
SCOPE: PLATFORM-WIDE (Admin, OPS, Widget)

# INNOVOOT — PRODUCT UX PRINCIPLES

Authoritative sources used: `PRODUCT_LANDSCAPE.md` (APPROVED), `PRODUCT_DEVELOPMENT_STRATEGY.md`, `PLANNING_BASELINE.md`, `DATA_PRIVACY_PRINCIPLES.md` (APPROVED), `PRD-001-FORMS-LEAD-CAPTURE-V1.md`, `FORMS-V1-DATA-REQUIREMENTS.md`, `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md`.

---

## 1. Purpose

Innovoot is a multi-vertical platform (Common Platform Capabilities + Vertical-Specific Modules) delivered through three separate experiences. Without a shared UX foundation, each future module — starting with Forms, then Healthcare Appointments — would independently invent its own interaction patterns, terminology, and state handling. That produces the exact outcome `PRODUCT_DEVELOPMENT_STRATEGY.md` and `PRODUCT_LANDSCAPE.md` warn against: a collection of disconnected modules rather than one coherent product.

This document exists to fix UX principles _before_ module-level UX/IA work begins, so that:

- Every module inherits the same baseline instead of re-deciding it.
- Legacy Admin/InnoForms patterns are filtered through explicit principles, not copied by default.
- Product-first behavior is enforced: a database entity or technical capability does not by itself justify a screen, module, or workflow.

This is a principles document. It does not design any screen, IA tree, or component.

---

## 2. Product Experience Model

**CONFIRMED** (`PRODUCT_LANDSCAPE.md`, `PRODUCT_DEVELOPMENT_STRATEGY.md` §5):

| Experience | Audience                                 | Responsibility                                                                |
| ---------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| **Admin**  | Business/tenant administrators and staff | Configure and operate the tenant's business, across verticals                 |
| **OPS**    | Innovoot internal users                  | Manage tenant accounts, platform-wide configuration, and cross-tenant support |
| **Widget** | Public/end customers                     | Embedded and hosted public-facing experiences (forms, booking, etc.)          |

These are treated as **separate application experiences within one platform** — not three skins of the same app. Each has a different audience, trust level, and authentication posture, and UX decisions must respect that separation rather than assume shared layout or navigation.

**RECOMMENDATION:** Because Core Platform Capabilities are expected to appear in more than one experience (e.g., Forms is configured in Admin and consumed via Widget), the same underlying capability should present _consistent concepts and terminology_ across experiences even where the UI itself differs by audience. This is a principle, not a mandate for identical screens.

**OPEN:** Authentication architecture is explicitly not decided platform-wide (`PRODUCT_DEVELOPMENT_STRATEGY.md` §9); this document assumes each experience is independently authenticated but does not define how.

---

## 3. Common Platform + Vertical Modules

**CONFIRMED** (`PRODUCT_LANDSCAPE.md`): Innovoot = Common Platform Capabilities + Vertical-Specific Modules + Internal OPS Capabilities, for two initial verticals (Healthcare, Hospitality), with others deferred.

**UX PRINCIPLE:** A Common Platform Capability (e.g., Forms, and in future Booking/Appointments) must feel like the _same product_ regardless of which vertical is using it — same interaction language, same state patterns, same terminology conventions. Vertical-specific modules may introduce domain-specific workflows and fields on top of that shared foundation, but should not fork the underlying interaction patterns (list/detail conventions, status handling, form patterns, feedback patterns) without a documented reason.

This document does not define the future module list, does not decide which entities become common vs. vertical, and does not decide Healthcare/Hospitality module scope.

---

## 4. UX Principles (Platform-Wide)

| Principle                           | What it means at Innovoot                                                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Simplicity**                      | Default to the smallest interface that accomplishes the task; do not add UI for capabilities not yet in scope.                                              |
| **Task-oriented workflows**         | Screens are organized around what a user is trying to accomplish, not around database tables.                                                               |
| **Consistency**                     | Same interaction pattern for the same kind of action across all modules and experiences.                                                                    |
| **Progressive disclosure**          | Show what's needed now; surface advanced/secondary detail only on demand.                                                                                   |
| **Reuse before invention**          | A new module must first check whether an existing shared component/pattern serves the need before creating a new one.                                       |
| **Clear information hierarchy**     | Primary actions and primary data are visually and structurally distinguishable from secondary information.                                                  |
| **Clear system status**             | The user always has a legible answer to "what is happening / what just happened."                                                                           |
| **Predictable interactions**        | Similar actions behave the same way everywhere (e.g., how "create," "edit," "publish," "delete" behave).                                                    |
| **Error prevention and recovery**   | Prefer preventing invalid states over relying on error messages after the fact; when errors occur, preserve user input and offer a path forward.            |
| **Accessibility**                   | Baseline accessibility (§13) applies to every experience, not only public-facing ones.                                                                      |
| **Responsive design**               | Every experience adapts to its expected device range (§12); this is a baseline, not vertical/module-specific.                                               |
| **Mobile-first public experiences** | Widget/hosted public surfaces are designed mobile-first by default, given anonymous/public visitor context.                                                 |
| **Privacy-aware UX**                | UX decisions must reflect `DATA_PRIVACY_PRINCIPLES.md` — minimal collection, visible consent where applicable, no dark patterns around data collection.     |
| **Performance-aware UX**            | Interfaces avoid unnecessary complexity/weight, particularly on public surfaces (§16).                                                                      |
| **Tenant-aware experiences**        | Admin and Widget must always operate within a resolved tenant context; UX must never allow ambiguity about which tenant's data is being viewed or acted on. |

These principles are drawn from and must not conflict with the approved sources above; none introduce new product scope.

---

## 5. Admin UX Principles

Admin is the authenticated, tenant-scoped experience for business administrators and staff (`PRD-001` §10, §24).

- **Business-oriented workflows:** Screens are organized around business tasks (e.g., "manage leads," "publish a form"), not around raw data tables.
- **Clear navigation:** Users should always be able to tell which module and, where applicable, which business/branch context they are in.
- **Business/branch context:** Where a tenant has multiple businesses or branches, that context must be visibly and unambiguously indicated at all times it's relevant — **RECOMMENDATION**, generalizing the base kit's URL-is-source-of-truth business/branch pattern (`PLANNING_BASELINE.md` §14) as a UX principle; the base kit mechanism itself is a technical implementation detail, not redefined here.
- **Configuration vs. operational tasks:** Admin UX should let users distinguish "setting something up" (e.g., building a form) from "operating day to day" (e.g., working a lead) — these are different mental modes and should read as such.
- **List/detail patterns:** Modules exposing records (e.g., Forms, Leads) follow a consistent list → detail pattern: identify/triage in the list, act/inspect in the detail. This mirrors the confirmed Forms IA (`PRD-001` §9, §18).
- **Create/edit workflows:** Creation and editing follow one consistent pattern platform-wide (not decided per module) — draft-first-then-publish where a "live/public" state exists, consistent with Forms' draft→published model (`PRD-001` §14).
- **Status visibility:** Records with a lifecycle (e.g., a Lead's New/Contacted/Closed status) must always show current status at both list and detail level.
- **Feedback and confirmation:** Every state-changing action gives clear confirmation of success, and clear, actionable feedback on failure.
- **Empty/loading/error states:** Every list-bearing screen must define its empty, loading, and error state explicitly, consistent with the pattern established for Forms/Leads (`PRD-001` §27) — e.g., distinguishing "no forms published yet" from "forms published, no submissions yet" rather than a single generic empty state.
- **Permissions (future consideration only):** Admin UX should be built assuming a permission/role model will exist, without designing that model here. **OPEN** — Forms V1 currently assumes equal Admin/Staff access as a PRD-level assumption (`PRD-001` §24); no platform-wide permission model exists yet.

This section does not define Admin's navigation tree.

---

## 6. OPS UX Principles

- OPS serves **Innovoot internal users** for tenant account management, platform-wide configuration, and cross-tenant support (`PRODUCT_LANDSCAPE.md`).
- **CONFIRMED constraint (`DATA_PRIVACY_PRINCIPLES.md` §6):** OPS does not have unrestricted personal-data access by default; any access to tenant/end-customer personal data must be purpose-justified and auditable. This is a hard UX constraint: OPS UX should never present tenant personal data as freely browsable without that justification/audit context being part of the flow.
- **Do not assume Admin-capability parity.** OPS is not "Admin with more permissions" by default — what OPS needs to see/do for support and platform operation is a separate design question per capability, not a mirrored feature set.
- OPS UX should make **auditability visible in the interaction model** (e.g., actions that touch tenant data should read as accountable actions), consistent with the platform-wide audit logging requirement (`DATA_PRIVACY_PRINCIPLES.md` §12) — without this document prescribing an audit UI.

This section does not define OPS's navigation tree, and no OPS scope for Forms V1 exists yet (`PRD-001` §33 lists "OPS-level Forms/Leads support surface" as a deferred future consideration, not current scope).

---

## 7. Widget / Public UX Principles

Widget covers both the embeddable widget and equivalent Innovoot-hosted public experiences (§8).

- **Low friction:** Public flows should ask for the minimum needed to complete the task — consistent with the privacy principle of minimal data collection.
- **Mobile-first:** Designed for mobile first, since visitors arrive from arbitrary, often mobile, contexts and third-party pages.
- **Clear task completion:** The visitor should always have unambiguous confirmation that their action (e.g., a submission) succeeded or failed — consistent with the confirmed Forms behavior: clear success confirmation, clear error state with preserved input (`PRD-001` §21).
- **Minimal unnecessary UI:** No Innovoot chrome, navigation, or branding beyond what the capability requires — public surfaces should not feel like a leaked piece of Admin.
- **Clear validation:** Inline, field-level validation errors that never discard already-entered valid data (`PRD-001` §21, `FORMS-V1-DATA-REQUIREMENTS.md` §22).
- **Clear success/error states:** Including deliberately generic failure states where disclosing detail would create risk (e.g., spam/abuse rejection never reveals the classification, `PRD-001` §21–§22) — a platform-wide principle: public error messaging should never leak internal system reasoning that could be exploited.
- **Tenant branding:** Public surfaces reflect tenant branding (logo + primary color) sourced from the shared design system's theming mechanism — never bespoke per-surface styling (`PRD-001` §20).
- **Accessibility:** Same baseline expectations as Admin (§13); public/anonymous does not mean lower accessibility bar.
- **Trust/privacy considerations:** Where a capability collects personal data, the public UX must support presenting a consent/notice at the point of collection when the business configures one (`DATA_PRIVACY_PRINCIPLES.md` §9, `PRD-001` §13) — Innovoot provides the capability; legal sufficiency of notice content is a tenant/legal responsibility, not a UX decision.

**Distinction from Admin:** Widget UX assumes an anonymous, unauthenticated, single-task visitor in an unfamiliar context; Admin UX assumes an authenticated, returning, multi-task business user. These should not share layout or navigation patterns, even where they share the underlying design system.

---

## 8. Hosted Public Experiences

Where a capability has both an embeddable Widget and an Innovoot-hosted public page (as Forms does — `PRD-001` §12), the **principle** is:

- Both surfaces must provide **equivalent core functionality and behavior** — same data, same validation, same submission outcome — sourced from one underlying definition (no divergent copies).
- They are **not required to have identical presentation.** The hosted page is a standalone page (no host site required); the embedded widget renders inline inside a third-party page's context. Presentation differences that follow from those different contexts are expected.

This section does not define Forms' specific hosted/widget behavior — that is fully specified in `PRD-001` (already confirmed) and is out of scope for this document to restate or redesign.

---

## 9. Information Architecture Principles

These are principles only; the complete Innovoot IA is a separate future document.

- **Navigation hierarchy:** Each experience (Admin, OPS, Widget) has its own hierarchy; a module's place in that hierarchy should reflect what users are trying to do, not internal data modeling.
- **Terminology:** IA labels use confirmed product terminology (§17) consistently — e.g., "Leads," not "Leads & CRM" (`PRD-001` decision #16).
- **Grouping:** Related tasks are grouped together; unrelated technical entities are not grouped together merely because they share a database relationship.
- **Module boundaries:** A module's IA presence should match its product boundary. Forms and Leads are confirmed as distinct product modules because they represent different user tasks, even though Leads currently has only one source. Their final navigation placement (for example, sibling top-level items versus a grouped parent) remains OPEN and is addressed separately in §20.
- **Cross-module relationships:** Where one module's record references another (e.g., a Lead references its source Form), IA should support **linking to** the related record rather than nesting full ownership of it inside the other module — avoiding duplicate ownership.
- **Contextual navigation:** Where relevant (e.g., business/branch context in Admin), navigation should carry that context rather than requiring re-selection at every screen.
- **List/detail relationships:** A consistent pattern platform-wide: list view for triage, detail view for full record and actions (§5).
- **Avoiding duplicate ownership:** No two modules should independently mutate the same underlying data through separate UI surfaces without a single clear owner — this is called out explicitly because it is a **documented legacy risk** (`PRODUCT_LANDSCAPE.md`: legacy `HCQueueControl` vs. `HCVisitsTimeline`/`MRQueueDrawer` both mutating queue data). Future Booking/Appointments and any shared-data module design must establish single ownership from the start.

This section does not create the complete Innovoot IA or any experience's navigation structure.

---

## 10. Design System Principles

**CONFIRMED** (`PRODUCT_DEVELOPMENT_STRATEGY.md` §6, `PLANNING_BASELINE.md`):

- One shared Innovoot design system; Admin, OPS, and Widget consume the same foundational system (tokens, typography, color, spacing, radius, elevation, icons, components, states, accessibility rules, responsive principles).
- Design tokens are the source of truth for visual values — no raw hex values or arbitrary styling values without documented reason (`PLANNING_BASELINE.md` §14).
- Different applications (Admin/OPS/Widget) may have different **layouts and interaction patterns** built from the same foundational system — shared system does not mean identical UI.
- Components should be reusable; variants should be intentional, not ad hoc (base kit already establishes `class-variance-authority` for any component with 2+ variants — a technical convention this document does not redefine).
- Accessibility states (focus, disabled, error, etc.) are treated as part of a component's definition, not bolted on separately.
- Tenant branding **extends** the shared design system (via its theming mechanism) rather than bypassing it (§11).
- **Principle:** no arbitrary tenant CSS. Tenant customization happens through the design system's supported theming surface only.

This document does not define token values and does not duplicate the base kit's technical design-system implementation (already documented in `PLANNING_BASELINE.md` §2, §9–§11).

---

## 11. Tenant Branding Principles

**CONFIRMED** (`PRD-001` §20, as the concrete precedent): tenant branding is currently scoped to **one logo + one primary color**, applied uniformly, sourced from the shared design system's theming mechanism. Per-feature/per-form branding overrides are explicitly out of scope.

**PLATFORM PRINCIPLE (generalizing the above):**

- Tenant branding exists **within** the shared Innovoot design system — it is a themeable layer, not a parallel styling system.
- Avoid: per-feature visual systems, arbitrary custom CSS, uncontrolled theme overrides.
- Any future expansion of tenant branding (e.g., more granular per-capability branding) is a product decision to be made explicitly per capability, not assumed.

This document does not define the final branding architecture (e.g., how theming is technically implemented) — that is a base-kit/technical concern (`PLANNING_BASELINE.md` §9, ADR-007).

---

## 12. Responsive Design Principles

- **Admin:** Designed for the range of devices business users realistically use to operate their business (desktop and tablet primarily) — **RECOMMENDATION**, since no platform-wide Admin device-support policy is confirmed in the sources.
- **Public/Widget:** Mobile-first by default (§7, §4) — public surfaces must assume mobile as the primary, not secondary, context.
- **Consistent behavior across screen sizes:** A given task should remain completable and its meaning unchanged across breakpoints — layout adapts, functionality does not silently disappear.
- **Content prioritization over shrinking:** Responsive behavior should reprioritize what's shown, not simply scale a desktop layout down.

No exact breakpoints are defined here; that is a design-system/technical decision.

---

## 13. Accessibility Principles

Platform-level expectations, applicable to all three experiences:

- **Keyboard navigation:** All interactive elements must be operable without a mouse.
- **Focus:** Focus state must be visible and follow a logical order; focus should not be lost or trapped unexpectedly.
- **Labels:** All inputs and controls must have programmatically associated labels, not placeholder text alone.
- **Validation/errors:** Errors must be announced and associated with their field, not conveyed by color/position alone.
- **Contrast:** Text and meaningful UI elements must meet baseline contrast expectations.
- **Semantic structure:** Markup should use appropriate semantic elements/roles rather than purely visual structure.
- **Screen readers:** Dynamic state changes (loading, success, error) must be perceivable by assistive technology, not only visually.
- **Touch targets:** Interactive elements, especially on mobile/public surfaces, must be large enough to reliably operate by touch.

**OPEN:** No formal accessibility conformance level (e.g., WCAG 2.1 AA) is confirmed platform-wide — this is flagged in `PRD-001` §26 as a platform-level gap, not resolved there or here. This document does not prescribe implementation code.

---

## 14. States & Feedback Principles

Every module/surface should define its behavior for each of the following, following one consistent platform vocabulary (this generalizes the pattern already confirmed for Forms in `PRD-001` §21, §27):

| State           | Principle                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**     | Always distinguishable from empty or broken; used whenever a result is pending.                                                                                                                                     |
| **Empty**       | Distinguished from "loading" and "error"; where relevant, distinguishes _why_ it's empty (e.g., "no forms published yet" vs. "no submissions yet" — not a single generic empty state).                              |
| **Success**     | Explicit, clear confirmation of what happened.                                                                                                                                                                      |
| **Warning**     | Used when an action is valid but has a consequence the user should know about, before or after acting.                                                                                                              |
| **Error**       | Explains what went wrong in user-facing terms and what the user can do next; never discards valid user input where avoidable.                                                                                       |
| **Disabled**    | Visually distinct from interactive elements, with a reason inferable or explained.                                                                                                                                  |
| **Processing**  | Shown for in-flight state-changing actions so the user isn't left uncertain whether an action registered.                                                                                                           |
| **Unavailable** | Used when something previously accessible is no longer available (e.g., an unpublished form's public link shows "This form is no longer available," `PRD-001` §14, §21) rather than a generic error or broken page. |

**Principle:** Public-facing error states must never leak internal system reasoning that could be exploited (e.g., spam/abuse classification is never disclosed to the visitor, and — per confirmed API/behavioral decision B4 — not disclosed to Admin users either).

---

## 15. Data / Privacy UX Principles

Derived from `DATA_PRIVACY_PRINCIPLES.md` (APPROVED, authoritative). UX principles only — no new privacy policy, no invented retention periods, no legal claims.

- **Consent/notice at point of collection:** Where a capability collects personal data from a public/end customer, the UX must support presenting a consent/notice at the point of collection (§9 of the source). Innovoot provides the _capability_; exact legal wording is a tenant/legal responsibility, not a UX decision Innovoot makes on the tenant's behalf.
- **Minimal collection reflected in UX:** Interfaces should not solicit more personal data than the capability's defined data boundary permits (e.g., Forms V1's ordinary-contact-data boundary, `DATA_PRIVACY_PRINCIPLES.md` §17 as ratified in `PRD-001` decision #11).
- **Tenant isolation is a hard UX constraint, not just a backend rule:** No UI may ever present, even momentarily, another tenant's data (§4 of the source) — this applies to Admin and Widget equally.
- **Access scoping visible in UX:** Admin UX should only ever present the acting tenant's own data; OPS UX must reflect the purpose-justified, auditable nature of any personal-data access (§6, §12 of the source; see §6 of this document).
- **Deletion-aware UX:** Where a capability supports record deletion (e.g., an individual Lead), the UX should treat deletion as a distinct, deliberate action — consistent with tenant/lead deletion being supported platform capabilities (§8 of the source) — without this document defining the deletion flow itself.
- **Retention not yet tenant-configurable:** UX must not offer tenant-configurable retention settings, since retention is platform-defined and not tenant-configurable in V1 (§7 of the source).
- **No dark patterns:** Consent, notice, and data-collection UX must be presented plainly and honestly — this follows directly from the consent/notice and privacy-request principles (§9, §10 of the source) and is stated here as a UX principle, not a new policy.

---

## 16. Performance UX Principles

- **Fast initial experience:** Especially for public Widget/hosted surfaces, where a slow first render directly costs task completion from an anonymous visitor.
- **Avoid unnecessary UI complexity:** Simpler interfaces are inherently faster to load and faster to use — this is also a restatement of the Simplicity principle (§4) from a performance angle.
- **Progressive loading where appropriate:** Show usable content as soon as it's available rather than blocking on everything at once, particularly for list-heavy Admin screens.
- **Efficient public widget experience:** The embeddable widget in particular must be lightweight, since it loads inside a third-party page and should not degrade that page's performance.

No specific technical performance targets (load-time budgets, bundle-size limits, etc.) are established in the authoritative sources, so none are defined here.

---

## 17. Terminology Principles

- Product terminology must be **consistent, user-oriented, and stable** across Admin, OPS, and Widget — the same concept should be called the same thing everywhere.
- **CONFIRMED naming decisions to date:**
  - Use **"Tenant"** consistently where the platform-level/internal concept is meant (business/tenant administrators, tenant isolation, tenant branding).
  - Use **"Leads"**, not "Leads & CRM" — the Admin module is named "Leads" (`PRD-001` decision #16); Leads is explicitly not a CRM/pipeline (no lead scoring, assignment, or pipeline concepts in V1, `PRD-001` §7, and reaffirmed by API/behavioral decision B3, which keeps Lead status changes bidirectional among three fixed statuses without introducing pipeline/CRM behavior).
- A complete terminology dictionary is not created here — this section only fixes what is already confirmed and states the principle that future terminology decisions should follow the same standard.

---

## 18. Legacy UX Evidence

**Legacy Admin and InnoForms are evidence only.**

Useful legacy interaction patterns may inform future UX exploration — for example, the Forms PRD process already identified specific legacy Forms patterns worth carrying forward as _evidence for later UX/IA design_, not as binding requirements: the field-builder interaction (type dropdown, required toggle, reorder, duplicate/delete), live preview alongside editing, embed-code presentation, and breadcrumb navigation (`PRD-001`, "Legacy UX evidence note").

The following legacy elements must **not** automatically become Innovoot requirements:

- Architecture
- Navigation
- Monetization (e.g., legacy pricing tiers, paywalled comparison tables)
- Feature packaging (e.g., legacy "Form Mode: Single/Multiple" toggle, template-selection architecture)
- UI patterns not explicitly evaluated and re-approved
- Terminology (e.g., legacy "Leads & CRM" labeling, explicitly rejected — §17)

Each legacy pattern under consideration should go through the same evaluation used for Forms: identify it, classify it (KEEP/REDESIGN/REMOVE/NEW/NEEDS DECISION), and only adopt it if it survives that evaluation against current product requirements — not by default inheritance.

---

## 19. What This Document Does Not Decide

Explicitly deferred to later documents:

- Complete product Information Architecture
- Final Admin navigation
- Final OPS navigation
- Final Widget navigation/structure
- Feature-specific UX (including Forms-specific UX/IA, screens, or flows beyond what `PRD-001` already confirms)
- Detailed design system specification (component inventory, visual design, token values)
- Authentication UX
- Permissions model
- Future vertical UX (Healthcare, Hospitality, or any deferred vertical)

---

## 20. Open UX / IA Questions

Only genuine platform-level questions, none of which reopen approved Forms decisions:

**UX decisions (open):**

1. Formal accessibility conformance target (e.g., WCAG 2.1 AA) is not yet set platform-wide (`PRD-001` §26).
2. Admin's responsive/device-support policy is not formally confirmed anywhere in the sources (this document's §12 Admin guidance is a recommendation, not a confirmed decision).

**IA decisions (open):** 3. Whether Forms and Leads (and future modules generally) sit as flat top-level Admin navigation items or under a shared parent grouping is explicitly flagged as an assumption in `PRD-001` §9, to be confirmed during UX/IA design — not decided here.

**Design-system decisions (open):** 4. Token values and full component inventory do not exist yet — tracked as a base-kit/design-system workstream, not a product decision.

**Technical decisions (out of scope for this document, noted only for traceability):** 5. Authentication architecture platform-wide (`PRODUCT_DEVELOPMENT_STRATEGY.md` §9) — affects Admin/OPS UX but is not decided here. 6. Mock↔real API switching mechanism and backend integration timing (`PLANNING_BASELINE.md` §15) — technical, not a UX principle.

---

## 21. Traceability

| Principle area                                                    | Source                                                        | Status                                                                   |
| ----------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Three experiences (Admin/OPS/Widget) and audiences                | `PRODUCT_LANDSCAPE.md`, `PRODUCT_DEVELOPMENT_STRATEGY.md` §5  | CONFIRMED                                                                |
| Common Platform + Vertical Modules model                          | `PRODUCT_LANDSCAPE.md`                                        | CONFIRMED                                                                |
| One shared design system across experiences                       | `PRODUCT_DEVELOPMENT_STRATEGY.md` §6, `PLANNING_BASELINE.md`  | CONFIRMED                                                                |
| Tenant branding = logo + primary color, via design-system theming | `PRD-001` §20                                                 | CONFIRMED (Forms-specific precedent, generalized here as RECOMMENDATION) |
| List/detail, draft→publish, status-lifecycle patterns             | `PRD-001` §9, §14, §17, §18                                   | CONFIRMED (Forms-specific precedent, generalized here as RECOMMENDATION) |
| Validation/error/success/unavailable state patterns               | `PRD-001` §21, §27; `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` | CONFIRMED (Forms-specific precedent, generalized here as RECOMMENDATION) |
| Consent/notice, minimal collection, tenant isolation in UX        | `DATA_PRIVACY_PRINCIPLES.md` §4, §9, §17                      | CONFIRMED                                                                |
| OPS restricted, auditable access                                  | `DATA_PRIVACY_PRINCIPLES.md` §6, §12                          | CONFIRMED                                                                |
| "Leads" not "Leads & CRM"; "Tenant" terminology                   | `PRD-001` decision #16                                        | CONFIRMED                                                                |
| Duplicate-ownership risk (queue example)                          | `PRODUCT_LANDSCAPE.md`, legacy evidence section               | CONFIRMED (as documented legacy risk)                                    |
| Legacy field-builder/live-preview/embed/breadcrumb patterns       | `PRD-001`, legacy UX evidence note                            | CONFIRMED (as evidence only, not requirement)                            |
| Admin device/responsive policy                                    | _(no source)_                                                 | RECOMMENDATION                                                           |
| Accessibility conformance level                                   | _(unset)_                                                     | OPEN                                                                     |
| Navigation grouping (flat vs. parent-grouped)                     | `PRD-001` §9                                                  | OPEN (assumption pending UX/IA confirmation)                             |

---

## 22. Consistency Check

Verified against `PRODUCT_LANDSCAPE.md`, `PRODUCT_DEVELOPMENT_STRATEGY.md`, `PLANNING_BASELINE.md`, `DATA_PRIVACY_PRINCIPLES.md`, `PRD-001`, Forms Data Requirements, and Forms API/Behavioral Requirements.

This document does **not** introduce:

- ❌ New product scope — no new capability is proposed.
- ❌ CRM functionality — explicitly excluded per `PRD-001` §7 and reaffirmed by API/behavioral decision B3; §17 fixes "Leads" naming precisely to avoid CRM framing.
- ❌ Analytics — not addressed; remains a deferred Forms consideration (`PRD-001` §34) and is not asserted here.
- ❌ Additional verticals — only Healthcare and Hospitality are referenced, per `PRODUCT_LANDSCAPE.md`.
- ❌ New Forms functionality — Forms-specific behavior is only cited as confirmed precedent, never extended or reinterpreted.
- ❌ Legacy monetization — explicitly excluded in §18.
- ❌ Per-form/per-feature branding — explicitly excluded in §11, consistent with `PRD-001` §20.
- ❌ API/database decisions — none made; all technical/API items are flagged OPEN or explicitly out of scope.
- ❌ Architecture changes — base kit conventions (`PLANNING_BASELINE.md`) are referenced, not altered.

No contradictions found.

---

## FINAL SUMMARY

### CONFIRMED UX PRINCIPLES

- Three distinct experiences (Admin, OPS, Widget) with distinct audiences and responsibilities.
- Common Platform Capabilities + Vertical-Specific Modules as the underlying product model.
- One shared Innovoot design system across all three experiences; tokens are the source of truth; tenant branding extends (not bypasses) the system.
- Tenant isolation, minimal data collection, consent-at-collection, and OPS-restricted/auditable access are hard UX constraints, not optional.
- "Leads" (not "Leads & CRM") and "Tenant" as fixed terminology.
- Legacy Admin/InnoForms are evidence only; specific useful patterns (field-builder, live preview, embed presentation, breadcrumbs) are retained as evidence, not requirements; legacy monetization, packaging, and rejected terminology are explicitly not carried forward.
- Duplicate data ownership across UI surfaces is a known legacy risk to be avoided by design.

### RECOMMENDED UX PRINCIPLES

- Generalizing Forms' confirmed list/detail, draft→publish, and state-handling patterns into platform-wide conventions for future modules.
- Admin responsive design targeting desktop/tablet primarily (no confirmed source; recommendation only).
- Common Platform Capabilities should share terminology and interaction language across verticals even where screens differ.

### OPEN UX / IA QUESTIONS

- Formal accessibility conformance target platform-wide.
- Admin's device/responsive support policy.
- Flat vs. parent-grouped Admin navigation for modules like Forms/Leads.

### DEFERRED DECISIONS

- Complete product IA; final Admin/OPS/Widget navigation trees.
- Feature-specific UX beyond what `PRD-001` already confirms.
- Full design-system spec (component inventory, visual design, token values).
- Authentication UX; permissions model; future vertical UX.

### TRACEABILITY

See §21 — every principle is mapped to its source document and status (CONFIRMED / RECOMMENDATION / OPEN).

### CONSISTENCY CHECK

No new product scope, CRM functionality, analytics, additional verticals, new Forms functionality, legacy monetization, per-form branding, API/database decisions, or architecture changes were introduced. See §22.

### RECOMMENDED NEXT STEP

Review and approve/amend this document as the platform-level UX baseline; once approved, proceed to a dedicated **Innovoot Information Architecture** document (complete Admin/OPS/Widget navigation structure) as the next planning artifact — Forms-specific UX/IA design should follow that, not precede it.
