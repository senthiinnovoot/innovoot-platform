# INNOVOOT — FORMS / LEAD CAPTURE V1 UX SPECIFICATION

**Path (proposed, not yet created in repository):** `docs/ux/forms/FORM_UX_SPECIFICATION_V1.md`
**Status:** APPROVED — IMPLEMENTATION READY (as of 2026-08-22); **amended 2026-08-22** to record one approved implementation decision (Forms/Leads Admin nav icons — see §20a and the Decision Log at the end of this document). No product, UX, scope, IA, or component-mapping decision other than the two nav icons is changed by this amendment.
**Owner:** Innovoot Product Planning
**Sources of authority (in priority order):** `PRODUCT_LANDSCAPE.md` → `PRODUCT_UX_PRINCIPLES.md` → `INFORMATION_ARCHITECTURE.md` → `DATA_PRIVACY_PRINCIPLES.md` → `PRD-001-FORMS-LEAD-CAPTURE-V1.md` (APPROVED — IMPLEMENTATION READY) → `FORMS-V1-DATA-REQUIREMENTS.md` → `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` (APPROVED — IMPLEMENTATION READY) → `docs/design-system/tokens.md` + Base Kit component inventory (implementation evidence)
**Legacy status:** Legacy InnoForms/Admin material (screenshots, `DESIGN_SYSTEM.md`/IFDS, `PROJECT.md` widget catalogue) used as evidence only. No legacy UX, IA, pricing, or form-type architecture is carried forward.

---

## 1. Purpose

This document defines the complete V1 UX/Information Architecture for Forms/Lead Capture, positioned in the planning chain as:

```
PRD-001 (what/why, business rules)
  → Data Requirements (conceptual data model)
  → API/Behavioral Requirements (system behavior contracts)
  → THIS DOCUMENT — UX Specification (screens, journeys, states, IA, component mapping)
  → Implementation (Claude Code handoff, once APPROVED)
```

It does not restate PRD-001/Data/API content as new decisions — it translates already-CONFIRMED product behavior into UX form (screens, flows, states, layout intent), and identifies genuinely new UX-layer questions.

**Legend used throughout:**

- **CONFIRMED** — direct restatement of an already-approved decision (PRD-001 / Data Requirements / API-Behavioral / PRODUCT_UX_PRINCIPLES / INFORMATION_ARCHITECTURE). Not open for silent reinterpretation here.
- **UX RECOMMENDATION** — a UX-layer judgment call this document is making, consistent with but not dictated by the sources. Flagged as `ASSUMPTION` where it proceeds without confirmation.
- **OPEN** — a genuine gap, carried forward or newly surfaced, requiring your decision.
- **LEGACY EVIDENCE** — informs the pattern but is not a requirement.

---

## 2. Users and Context

No new personas are introduced beyond PRD-001 §4.

| User               | Experience                          | Goal                                                           | Entry Point                                                  | Primary Tasks                                                       | Expected Outcome                                                                 |
| ------------------ | ----------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Tenant Admin**   | Admin                               | Capture and act on leads with minimal setup                    | Admin nav → Forms / Leads                                    | Create, configure, publish/unpublish forms; view/update Lead status | A working form generating qualified Leads, visible in one place                  |
| **Business Staff** | Admin                               | Same day-to-day as Admin (PRD-001 §24: equal read/write in V1) | Admin nav → Forms / Leads                                    | Same as Tenant Admin                                                | Same as Tenant Admin                                                             |
| **Public Visitor** | Widget (inline embed) / Hosted page | Submit an enquiry quickly, without friction                    | Tenant's own website (widget) or a shared link (hosted page) | Fill and submit a form                                              | Clear success confirmation, or a clear, non-alarming reason it didn't go through |

**OPS is explicitly OUT OF SCOPE** for Forms V1 (PRD-001 §4) — no OPS screens are defined in this document.

**ASSUMPTION (carried from PRD-001 §24):** Tenant Admin and Business Staff have identical Forms/Leads permissions in V1 — this document does not design a permission-differentiated UX (e.g., no role-gated buttons). Flagged OPEN at product level (§24 of API-Behavioral doc, item 3), not resolved here.

---

## 3. Information Architecture

Per `INFORMATION_ARCHITECTURE.md` §5 (CONFIRMED, closed IA decision) — this document does not redesign this:

```
Admin
├── Overview                [not part of Forms scope]
├── Forms                   ← sibling top-level module
│   ├── Forms List
│   ├── Create Form
│   ├── Form Detail / Edit
│   └── Publish / Distribution
├── Leads                   ← sibling top-level module (not nested under Forms)
│   ├── Leads List
│   └── Lead Detail
└── Settings                [not part of Forms scope]
```

**Cross-navigation (UX RECOMMENDATION, not a nav restructure):**

- From **Form Detail**, a "View Leads from this form" affordance opens Leads List **pre-filtered** by that source form (uses the already-confirmed source-form filter, PRD-001 §18/§10).
- From **Lead Detail**, the source Form name is a link back to that **Form Detail** page.
- Neither link changes Leads' status as an independently navigable top-level module — this is cross-module **linking**, not nesting (consistent with `INFORMATION_ARCHITECTURE.md` §5's stated rationale and its Navigation Map's "cross-module linking, not nesting" principle).

**Nav icons (see §20a):** Forms and Leads, as sibling top-level Admin nav items, each carry a nav icon. This is an implementation-level detail of an already-CONFIRMED nav placement, not a new IA decision — see §20a for the approved icon assignment.

---

## 4. Complete V1 User Journeys

### 4.1 Business Journeys

**Create → Publish → Manage Leads (happy path)**

1. Admin opens Forms List → clicks "Create Form."
2. Names the form, adds fields in order, sets required/optional per field, optionally adds a Consent/Notice field, sets CTA text (defaults to "Submit" if left blank).
3. Saves as Draft (repeatable, no publish required to save).
4. Reviews via Preview.
5. Publishes → receives both an embed snippet and a hosted-page link.
6. Copies/shares either or both.
7. Visitor submits → Lead appears in Leads List, tenant notification email sent.
8. Admin opens Lead Detail, updates status (New → Contacted → Closed, or backward — CONFIRMED bidirectional, API-Behavioral B3).
9. Admin may edit the Published form at any time — **changes take effect immediately on both public surfaces, no republish step** (CONFIRMED, decision B1). Historical Submissions/Leads are never rewritten.
10. Admin may unpublish → existing links/embeds remain technically valid but show "This form is no longer available" to visitors (CONFIRMED, PRD-001 §14).

**Important intermediate/edge states to design for (not just happy path):**

- Attempting to Publish a form with zero fields, or only a Consent/Notice field → **blocked**, with a clear reason shown (CONFIRMED, decision B5).
- Editing a field on a Published form → no confirmation dialog is specified anywhere in the approved sources; **OPEN (UX-level)** — see §20.
- Re-publishing a previously Unpublished form → **ASSUMPTION** (API-Behavioral doc): re-publish reuses the same retained embed/hosted artifacts, so existing links/embeds "come back to life" rather than requiring new ones. UX must not silently generate new snippets on re-publish, since that would contradict "existing links remain valid."

### 4.2 Public Visitor Journeys

**Embedded widget / hosted page (functionally equivalent, per PRODUCT_UX_PRINCIPLES §8):**

1. Visitor lands on the widget-hosting page or the hosted form URL.
2. Form loads with tenant branding already applied (no flash of unbranded/default state — consistent with legacy evidence and general performance-UX principle §16, not a new requirement).
3. Visitor fills fields; inline validation runs on blur/submit.
4. Visitor checks Consent/Notice box, if present and required.
5. Visitor submits.
6. **Client validation fails** → inline errors at offending field(s), valid entries preserved (CONFIRMED).
7. **Client validation passes** → spam/abuse + server validation run.
   - **Spam/abuse or server rejection** → generic failure message, entered data preserved, retry available (CONFIRMED — visitor is never told which check failed; API-Behavioral B4 — not disclosed to Admin either).
   - **Success, but Lead creation not confirmed** → same generic failure state as any other submission failure (CONFIRMED, decision B2 — success is never shown speculatively).
   - **Success, Lead confirmed created** → clear success confirmation shown.
8. **Unpublished form reached via a live link/embed** → "This form is no longer available" state shown instead of the form (CONFIRMED).

---

## 5. Screen Inventory

| Screen                        | Surface | User               | Purpose                                                                                           | Entry                                          | Exit                                                    | Priority                             |
| ----------------------------- | ------- | ------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| Forms List                    | Admin   | Tenant Admin/Staff | See all forms, their state, create new                                                            | Forms nav item                                 | Create Form / Form Detail                               | Must-have                            |
| Create Form                   | Admin   | Tenant Admin/Staff | Name a new form, land in the editor                                                               | "Create" action on Forms List                  | Form Detail/Edit (Draft)                                | Must-have                            |
| Form Detail / Edit            | Admin   | Tenant Admin/Staff | Configure fields, CTA, consent; save/publish/unpublish                                            | Forms List row, Create Form                    | Forms List, Leads List (filtered), Publish/Distribution | Must-have                            |
| Form Preview                  | Admin   | Tenant Admin/Staff | See representative public rendering before/while publishing                                       | Within Form Detail/Edit                        | Back to Form Detail/Edit                                | Must-have                            |
| Publish / Distribution        | Admin   | Tenant Admin/Staff | Obtain/copy embed snippet + hosted link; see published state                                      | Publish action on Form Detail                  | Form Detail                                             | Must-have                            |
| Unpublish confirmation/state  | Admin   | Tenant Admin/Staff | Confirm unpublish; reflect Unpublished state afterward                                            | Unpublish action on Form Detail/Publish screen | Form Detail                                             | Must-have                            |
| Leads List                    | Admin   | Tenant Admin/Staff | See/filter all leads for the tenant                                                               | Leads nav item, "View Leads" link from a Form  | Lead Detail                                             | Must-have                            |
| Lead Detail                   | Admin   | Tenant Admin/Staff | See full submission, update status, jump to source Form                                           | Leads List row                                 | Leads List, Form Detail                                 | Must-have                            |
| Embedded Form (widget)        | Public  | Visitor            | Fill and submit a form inline on the tenant's site                                                | Tenant's own web page                          | Success / Error / Unavailable state (same view)         | Must-have                            |
| Hosted Form (standalone page) | Public  | Visitor            | Fill and submit a form via a direct shared link                                                   | Shared URL                                     | Success / Error / Unavailable state (same view)         | Must-have                            |
| Submission Success            | Public  | Visitor            | Confirm the submission worked                                                                     | Post-submit, on confirmed Lead creation        | End of task                                             | Must-have                            |
| Validation / Error            | Public  | Visitor            | Show recoverable inline or generic errors                                                         | Post-submit failure (validation, server, spam) | Retry (same form)                                       | Must-have                            |
| Generic Spam/Abuse Rejection  | Public  | Visitor            | Same visible surface as Validation/Error — **not a distinct screen**, a state within it (see §14) | —                                              | —                                                       | Must-have (as a state, not a screen) |
| Unpublished Form              | Public  | Visitor            | Explain the form is no longer available                                                           | Visiting a live but unpublished link/embed     | End of task                                             | Must-have                            |

No screens beyond this set are introduced — no Analytics, no Submission Review Queue, no OTP/multi-step screens, per PRD-001's explicit exclusions.

---

## 6. Forms List UX

- **Information hierarchy:** form title first (primary), status second, a lead-count-free summary next (no analytics, per PRD-001 §34 deferred). **UX RECOMMENDATION (not a confirmed data requirement):** columns = Title, Status (Draft/Published/Unpublished), Last Updated. "Last Updated" is proposed for scannability; no Data Requirements or API/Behavioral source explicitly confirms an updated-at field is captured or exposed for Forms — this column is therefore a UX recommendation and implementation dependency, not approved scope, and should be validated against the actual Form data model before being built. No submission-count or view-count column — that would be analytics, explicitly out of scope.
- **Empty state:** distinguishes "no forms created yet" (first-run) from any filtered-empty state, per `PRODUCT_UX_PRINCIPLES.md` §14's "distinguishes _why_ it's empty" principle.
- **Loading state:** standard list-loading pattern (existing `feedback/LoadingState` component).
- **Error state:** standard list-error pattern (existing `feedback/ErrorState` component), with retry.
- **Search/filter:** **OPEN.** `INFORMATION_ARCHITECTURE.md` §14 confirms the Base Kit mock API has no free-text search implemented, and does not assume search is needed per module. For a first-V1 tenant with a handful of forms, a plain list is likely sufficient. **UX RECOMMENDATION:** no search/filter control in V1; revisit if real usage shows tenants routinely creating many forms.
- **Create action:** primary, high-visibility action (top-right per prevailing Admin convention — not fixed in tokens, a layout choice).
- **Form status:** Draft / Published / Unpublished, shown as a status indicator (existing `data-display/StatusBadge` component — see §19).
- **Relationship to Leads:** each row can carry a lightweight "View Leads" action linking to the pre-filtered Leads List (§3) — this is a link, not embedded Lead data (no lead count/analytics on this screen).

---

## 7. Form Creation / Editing UX

Confirmed field set only (PRD-001 §13, Data Requirements §7): **Text, Textarea/message, Email, Phone, Select/dropdown, Consent/Notice checkbox.**

- **Form name/title:** single required text input, business-facing label only.
- **Field list:** ordered, editable list — each row shows type, label, required toggle.
- **Add field:** explicit action, opens a field-type chooser limited to the six confirmed types. **No other type may be added or appear as an option** — this constrains the UI, not just documentation, since an out-of-set type is a validation failure at the API layer (API-Behavioral §4.3).
- **Field type:** fixed dropdown/selector of the six types; changing an existing field's type after creation is **not addressed** in any approved source — **OPEN**, see §20.
- **Field label:** required text per field.
- **Required/optional:** independent per-field toggle (CONFIRMED, Data Requirements §8).
- **Field ordering:** drag-reorder or up/down controls; order must persist and be respected on both public surfaces (CONFIRMED, API-Behavioral §4.4).
- **Duplicate:** legacy-evidence pattern, retained as a UX convenience — duplicating a field is a pure editor-UX action with no product-rule implication, so it is safe to keep.
- **Delete:** removes a field from the current definition; per API-Behavioral §8, a submission referencing a removed field is rejected against the _current_ definition — the editor should make clear that deleting a field on a Published form takes effect immediately (ties to B1).
- **CTA text:** single text input, placeholder/default "Submit" if left blank (CONFIRMED). No color/size/shape controls — explicitly excluded (PRD-001 §13).
- **Consent/Notice field:** added via the same "Add field" flow as any other type; additionally exposes a notice-text input and its own required/optional toggle (CONFIRMED, API-Behavioral §4.7). No separate "Consent settings" panel — it is a normal field with an extra text property.
- **Save:** persists the current definition as Draft (or, if already Published, applies immediately — no separate "Save & Publish" merge step implied, those remain distinct actions).

**Explicitly not designed, per instruction:** paid field limits, tiered forms, OTP, multi-step, conditional logic, AI qualification, per-form branding toggle. None of these appear anywhere in this section or elsewhere in this document.

**Legacy evidence used:** the field-builder interaction shape (type dropdown, required toggle, reorder, duplicate/delete) is retained as evidence for _interaction pattern_, redesigned using Innovoot's own design-system primitives (`Select`, `Switch`, `Input`) — not the legacy visual system.

---

## 8. Form Preview UX

- **Desktop and mobile:** both representative renderings should be viewable from the editor, consistent with the "public/widget is mobile-first" principle (`PRODUCT_UX_PRINCIPLES.md` §7) — the mobile view is not a secondary afterthought.
- **Representative public appearance:** preview shows the form as a visitor would see it — fields, order, required indicators, CTA text, and the Consent/Notice field if present.
- **Tenant branding:** preview reflects the tenant's actual logo/primary color (CONFIRMED — branding is tenant-level, sourced from the shared design system's theming mechanism, PRD-001 §20). This document does not define _how_ that theming is technically applied (that's ADR-007 territory).
- **Validation:** preview does not need to simulate submission/validation error states (visitor-side validation is exercised on the live surfaces, not required to be replicated pixel-for-pixel in the preview) — **UX RECOMMENDATION**, since no source requires interactive preview validation.
- No visual token values (colors, spacing, shadow values) are defined here, per instruction — those remain owned by `docs/design-system/tokens.md`.

---

## 9. Publish / Distribution UX

Both confirmed mechanisms, from one Form definition (CONFIRMED, PRD-001 §12, §14):

| Mechanism                 | What the tenant sees                      | What they receive       | How they share                                                             | After publishing                                                                                  | Unpublishing                                                                                  |
| ------------------------- | ----------------------------------------- | ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Embeddable widget**     | An embed snippet block with a copy action | A copyable code snippet | Paste into their own website                                               | Snippet remains valid indefinitely (until deletion of the form record, which is not a V1 feature) | Existing snippet stays technically valid; resolves to "no longer available" state (CONFIRMED) |
| **Hosted shareable page** | A shareable URL with a copy action        | A direct link           | Send via any channel (WhatsApp, SMS, bio link, etc. — PRD-001 §5 use case) | Link remains valid indefinitely                                                                   | Existing link stays technically valid; resolves to "no longer available" state                |

- Both artifacts appear together after Publish — the business is not forced to pick one (CONFIRMED, "may use either, both, or neither").
- **Legacy evidence used:** embed-code presentation with a copy-to-clipboard action is a retained interaction pattern — the actual snippet content/format is **not** assumed to match legacy implementation details (explicitly instructed: "do not assume legacy embed implementation details are still valid").
- **Unpublishing communication:** an explicit confirmation step before unpublishing is a reasonable UX safeguard given it affects live public surfaces — **UX RECOMMENDATION**, not mandated by any source, since unpublishing is non-destructive (record retained) but _is_ publicly visible the moment it happens.

---

## 10. Public Widget UX (inline only)

Per PRD-001 decision #13: **inline only**, no popup/modal/slide-in modes — this document introduces none.

| State                        | Behavior                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Loading                      | Widget shows a brief loading indicator before rendering fields — must not flash unbranded/default styling before tenant branding applies                                       |
| Field rendering              | Fields render in configured order, required indicators visible, respecting the six confirmed types                                                                             |
| Validation                   | Inline, per-field, on submit (and reasonably on blur); valid entries preserved on failure                                                                                      |
| CTA                          | Configured text (or "Submit" default); disabled/processing state while submission is in flight (per `PRODUCT_UX_PRINCIPLES.md` §14's "Processing" state principle)             |
| Consent                      | Rendered as a standard checkbox field with notice text; required enforcement same as any other required field                                                                  |
| Submission                   | Client validation → spam/abuse (opaque to visitor) → server validation → Lead creation confirmation                                                                            |
| Success                      | Clear, explicit confirmation replacing the form                                                                                                                                |
| Failure                      | Generic error message, form state preserved, retry available                                                                                                                   |
| Generic spam/abuse rejection | **Same** generic error message as any other failure — no separate visual treatment that could hint at cause (CONFIRMED, must not "vary in a way that reveals detection logic") |
| Unpublished form             | "This form is no longer available" replaces the widget entirely                                                                                                                |

Responsive behavior follows `PRODUCT_UX_PRINCIPLES.md` §7/§12: mobile-first by default, no exact breakpoints defined here (design-system/technical layer). Existing design-system tokens/components are used — no new visual system introduced.

---

## 11. Hosted Form Page UX

Minimum standalone experience — **not** a general page-builder:

- Tenant branding (logo + primary color) applied to a simple, single-purpose page.
- The form itself (same definition, same field rendering as the widget).
- Identical validation/submission/success/error/unpublished behavior as §10 (CONFIRMED functional equivalence, PRD-001 §12.1/§8 of PRODUCT_UX_PRINCIPLES).
- **CONFIRMED (this document, resolving PRD-001 §13's "Confirm during UX design" note):** minimal page chrome — tenant logo/branding and the form only. No Innovoot marketing navigation, promotional content, or unrelated Innovoot product chrome appears on the hosted form page. This is a Forms V1 UX decision, scoped to the hosted form page only — it does not establish a general Innovoot website/page-builder pattern and must not be read as one.

---

## 12. Leads UX

### Leads List

- **Required information (CONFIRMED minimum, PRD-001 §18):** enough to identify and triage — name/primary contact field, source form, status, date. Exact column set is a UX decision (this document): **Contact identifier, Source Form, Status, Date Received.**
- **Status:** New → Contacted → Closed, shown as a status indicator; bidirectional changes are valid anywhere in the product (CONFIRMED, decision B3) — the List/Detail UX must not present this as a locked forward-only pipeline.
- **Source form:** shown per row; list is filterable by source form (CONFIRMED, PRD-001 §18, §10).
- **Filtering:** by source form only (CONFIRMED scope, V1 MUST HAVE). **No** status filter, date-range filter, or search is confirmed anywhere. **UX RECOMMENDATION — OPEN, non-blocking, NOT a V1 must-have:** a status filter is a plausible low-risk addition since status is a first-class, already-modeled field; it is flagged here only as a candidate for future consideration, not as approved scope, and must not be built as if it were confirmed. Date-range/search remain unaddressed — **OPEN, non-blocking.**
- **Empty state:** distinguishes "no leads yet" from "no leads for this filtered source form."
- **Loading/error:** standard patterns, same as Forms List.

### Lead Detail

- Full submitted field data (CONFIRMED).
- Source form (link back to Form Detail, §3).
- Timestamp.
- Current status + a status-update control (New/Contacted/Closed, bidirectional).

**Explicitly excluded, per instruction and CONFIRMED scope:** assignment, ownership, pipeline, scoring, tagging, notes, bulk actions, export. None appear in either screen.

---

## 13. Form ↔ Lead Relationship

- **Form creates Lead:** every valid, non-spam submission automatically becomes exactly one Lead (CONFIRMED, no manual promotion step, PRD-001 §16).
- **Lead references originating Form:** shown on Lead Detail as a link (§3, §12).

---

## 14. State Matrix

8 states covered end to end (Admin and Public), each with what the user sees, what they can do, and how they recover:

| State                                     | What the user sees                                                                                                        | What the user can do                    | Recovery                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------- |
| **Loading**                               | Standard loading pattern (list/detail/widget as applicable)                                                               | Wait                                    | Resolves to content, empty, or error            |
| **Empty**                                 | Distinguishes "nothing created yet" from "nothing matches the current filter"                                             | Take the relevant creation/reset action | N/A                                             |
| **Validation error** (Public)             | Inline, per-field errors; valid entries preserved                                                                         | Correct the field(s) and resubmit       | Immediate, same form                            |
| **Server error** (Admin or Public)        | Generic error state with retry, no internal detail exposed                                                                | Retry                                   | Manual retry                                    |
| **Spam/abuse rejection** (Public)         | Same generic failure message as any other submission failure ("We couldn't submit your request. Please try again.")       | Retry                                   | Manual retry; no different messaging path, ever |
| **Unpublished** (Public)                  | "This form is no longer available"                                                                                        | Leave the page                          | N/A — no retry path applicable                  |
| **Success** (Public)                      | Explicit confirmation                                                                                                     | End of task                             | N/A                                             |
| **Processing** (Public, in-flight submit) | CTA shows a busy/disabled state so the visitor isn't left uncertain the click registered (`PRODUCT_UX_PRINCIPLES.md` §14) | Wait                                    | Resolves to success/error                       |

This matrix intentionally collapses "spam/abuse rejection" into the same visible state as generic server/validation failure — **there is no separate spam-rejection screen or visual signature**, consistent with the opacity requirement (CONFIRMED, PRD-001 §22, API-Behavioral §9, and B4 extending this opacity to Admin as well).

---

## 15. Responsive UX

| Surface        | Principle                                      | Status                                                                                                |
| -------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Admin desktop  | Primary target                                 | CONFIRMED-adjacent RECOMMENDATION (`PRODUCT_UX_PRINCIPLES.md` §12, `INFORMATION_ARCHITECTURE.md` §15) |
| Admin tablet   | Secondary target                               | RECOMMENDATION                                                                                        |
| Admin mobile   | No confirmed support level                     | **OPEN** — platform-wide gap, not resolved here                                                       |
| Public mobile  | Primary, mobile-first by default               | **CONFIRMED**                                                                                         |
| Public desktop | Fully supported, not the primary design target | CONFIRMED (equivalence requirement, §8/§10/§11 above)                                                 |

No exact breakpoints are invented here — that is a design-system/technical decision (per instruction and per `INFORMATION_ARCHITECTURE.md` §15).

---

## 16. Accessibility

Applying `PRODUCT_UX_PRINCIPLES.md` §13 directly, narrowed to Forms:

- **Keyboard navigation:** every field, the CTA, and all editor controls (add/reorder/delete field, publish/unpublish) must be operable without a mouse.
- **Focus, labels, validation announcement, contrast, semantic structure, screen-reader-perceivable state changes, and touch targets:** all apply to Forms' Admin and Public surfaces exactly as stated platform-wide in `PRODUCT_UX_PRINCIPLES.md` §13 — this section does not restate or relax that baseline, only confirms it applies here with no exceptions.
- **OPEN (platform-level, not resolved here):** no formal accessibility conformance level (e.g., WCAG 2.1 AA) is confirmed platform-wide (PRD-001 §26).

---

## 17. Terminology

Applying `PRODUCT_UX_PRINCIPLES.md` §17 directly: "Tenant" for the platform-level concept, "Leads" (never "Leads & CRM") for the module name. No Forms-specific terminology deviates from this.

---

## 18. Legacy UX Evidence

**USEFUL LEGACY EVIDENCE:** the field-builder interaction (type dropdown, required toggle, reorder, duplicate/delete), live preview alongside editing, embed-code presentation, and breadcrumb navigation — retained as evidence for later UX design, not as binding requirements (`PRD-001`, "Legacy UX evidence note").

### DO NOT CARRY FORWARD

- Pricing tiers / paywalled "Forms Comparison" table.
- Paid field limits.
- Legacy "Form Mode: Single/Multiple" toggle and template-selection architecture.
- Per-form theme/branding toggle.
- "Leads & CRM" terminology.
- Legacy display modes beyond inline (legacy `PROJECT.md` §14 shows `starter`/`verified`/`smart`/`conversion_pro` form types with OTP, conditional logic, and analytics — **none of these form types or their capabilities are carried forward**; V1 has exactly one form concept, no typed variants).
- Legacy popup/modal/hotel/appointment/chat widget infrastructure (`PROJECT.md` §14–§17) — unrelated to Forms V1 scope, noted only to confirm it was reviewed and excluded, not overlooked.

Legacy screenshots and `PROJECT.md`/`DESIGN_SYSTEM.md` (IFDS) content are references, not specifications, consistent with the project's Authority Rule.

---

## 19. Component / Design-System Mapping

Mapped against the confirmed Base Kit inventory (`PLANNING_BASELINE.md` §10; `docs/design-system/tokens.md`).

**Important scope note:** every "NEW COMPONENT REQUIRED" entry below is a **UX/design mapping recommendation for implementation planning**, based on the current Base Kit inventory as of this document's writing — it is **not** an approved implementation requirement and does not authorize component creation on its own. Per the Base Kit's own Reusability Rules (`CLAUDE.md` §5), Claude Code (or any implementer) must independently search for and validate whether an existing component already serves the need — including any components added since this document was written — before creating anything new, and must document the judgment call if a new component is genuinely required. This table identifies _gaps as currently understood_, not a build list.

| Need                                                              | Existing primitive/composite                                 | Existing Forms-adjacent component                      | Gap                                                                                                                                                                                                                         | Notes                                                                                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Embed snippet / copy-to-clipboard block                           | —                                                            | —                                                      | **NEW COMPONENT REQUIRED** — no existing primitive/composite covers a code-snippet-with-copy pattern                                                                                                                        | Feature-specific to Forms' Publish/Distribution screen                                                                                                           |
| Form Preview (rendered live form inside the editor)               | `Input`/`Select`/`Checkbox`/`Button`/`Text` (reused)         | `forms/FormField`                                      | —                                                                                                                                                                                                                           | Feature-specific composition, but built from existing primitives — no new primitive required                                                                     |
| Lead Detail key/value display                                     | —                                                            | `data-display/DefinitionList`, `data-display/KeyValue` | —                                                                                                                                                                                                                           |                                                                                                                                                                  |
| Lead status history/timeline (if ever shown)                      | —                                                            | `data-display/Timeline`                                | —                                                                                                                                                                                                                           | **Not required for V1** — no status-history UI is confirmed scope; flagged only as an existing option if ever needed                                             |
| **Forms Admin nav icon** and **Leads Admin nav icon**             | `design-system/icons/Icon` (existing installed icon library) | —                                                      | **RESOLVED — see §20a.** Forms uses a `file-text`/document-form icon; Leads reuses the existing `user` icon. Both come from the existing installed icon library. No new icon library and no other new icons are introduced. | Implementation-approved 2026-08-22 — this is an implementation-level detail of the already-CONFIRMED sibling-nav placement (§3), not a new IA or scope decision. |
| Other icons (field-type icons, copy/clipboard icon, status icons) | `design-system/icons/Icon`                                   | —                                                      | Current curated `IconName` union (`PLANNING_BASELINE.md` §9) may still not include icons for copy/clipboard or a per-field-type icon set — **still OPEN, not pre-authorized by this document** — see §20                    | Distinct from the nav-icon decision above; scoped separately                                                                                                     |

Per the Reusability Rules (`CLAUDE.md` §5), the two "NEW COMPONENT REQUIRED" table/list-of-reorderable-fields items should first be checked against each other for shared structure (both are ordered-row list patterns) before separate components are built — a design/implementation-time judgment call, not decided here. As stated above, none of the remaining "NEW COMPONENT REQUIRED" or "still OPEN" flags in this table are pre-approved to be built; they are inputs to that implementation-time judgment call, not a substitute for it. The Forms/Leads nav-icon row is the sole exception, per §20a.

---

## 20. UX Open Questions

Per instruction, none of the following reopen: Forms/Leads sibling nav, inline-only widget, hosted+embedded publishing, CTA default, consent field, tenant-level branding, lead statuses, notification recipient, unpublishing behavior, or PostgreSQL.

| #   | Question                                                                                                                                                      | Blocking?                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Should editing a field on a **Published** form show a confirmation/warning before the change takes effect immediately (B1), given it's a live public surface? | Non-blocking — a safe default (no confirmation, immediate save, consistent with B1's "no republish step") can proceed without one |
| 2   | Can an existing field's **type** be changed after creation (e.g., Text → Email), or must it be deleted and re-added? No approved source addresses this.       | Non-blocking for V1 build, but affects editor interaction design directly                                                         |
| 3   | Should unpublishing require an explicit confirmation step, given it immediately affects live public surfaces?                                                 | Non-blocking — recommended default (confirm) can proceed without formal sign-off                                                  |
| 4   | Should Leads List support a status filter in addition to the confirmed source-form filter? (UX RECOMMENDATION in §12, not approved scope.)                    | Non-blocking                                                                                                                      |
| 5   | Icon additions needed for copy/clipboard and per-field-type icons — outside the currently curated `IconName` union.                                           | Non-blocking — implementation-time addition                                                                                       |

~~Prior item #4~~ (hosted page minimal-chrome direction) is **RESOLVED** — see §11 (CONFIRMED). It no longer appears as an open item.
~~Forms/Leads Admin nav icons~~ (formerly part of item #5's "document/form" and nav-icon scope) is **RESOLVED** — see §20a. Item #5 above is retained but narrowed to the remaining, still-open icon needs (copy/clipboard, per-field-type icons).

Carried-forward, still-open, non-UX items (phone format, spam-attempt retention, staff/admin permission distinction, platform retention periods, `forms` module scaffolding) are **not repeated here** — they remain tracked in PRD-001 §33 / API-Behavioral §24 and are not UX decisions.

---

## 20a. Implementation Decision — Forms/Leads Admin Nav Icons (Approved 2026-08-22)

During implementation discovery, Claude Code confirmed that the current Base Kit has no existing icon in the installed icon library specifically intended for a Forms/document-form concept. The following implementation decision is **approved**, closing that specific gap:

- **Forms Admin nav icon:** a standard `file-text` / document-form icon, drawn from the **existing installed icon library** (no new icon library added).
- **Leads Admin nav icon:** reuse the **existing `user` icon**, already present in the installed icon library.
- **No new icon library is installed.**
- **No other new icons are introduced** beyond these two nav-icon assignments.
- This decision does **not** change the Forms/Leads Information Architecture or product scope (§3, §5 of `INFORMATION_ARCHITECTURE.md` remain exactly as CONFIRMED) — it is purely the visual-icon detail of an already-approved nav placement.

**Scope boundary:** this decision resolves only the Forms and Leads **top-level Admin nav icons**. It does not pre-authorize any other icon addition (e.g., copy/clipboard icon, per-field-type icons, status icons) — those remain OPEN per §19 and §20, item #5, and are unaffected by this decision.

This supersedes the prior blanket framing in §19, §20, the Final Summary, and the Recommended Next Step that treated _all_ icon needs, including the Forms/Leads nav icons, as uniformly "not pre-authorized." That framing was accurate as written at the time but is now out of date for these two specific icons; it has been corrected at each point above and below to avoid an internal contradiction.

---

## 21. Traceability

Every UX decision in this document maps to its PRD-001 / Data Requirements / API-Behavioral Requirements / PRODUCT_UX_PRINCIPLES / INFORMATION_ARCHITECTURE source section, as cited inline throughout §§1–18. The §20a nav-icon decision is an implementation-level detail of the already-traced §3/§5 sibling-nav-placement decision and does not require a new upstream product/PRD source — icon selection was never itself a product-scope decision in any of the nine authoritative/evidence sources.

---

## 22. Consistency Check

Re-verified against all nine authoritative/evidence sources: `PRODUCT_LANDSCAPE.md`, `PRODUCT_UX_PRINCIPLES.md`, `INFORMATION_ARCHITECTURE.md`, `DATA_PRIVACY_PRINCIPLES.md`, `PRD-001-FORMS-LEAD-CAPTURE-V1.md`, `FORMS-V1-DATA-REQUIREMENTS.md`, `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md`, `docs/design-system/tokens.md`, and `PLANNING_BASELINE.md`.

- ✅ No PRD scope expanded — field set, statuses, publishing mechanisms, branding model all restated exactly as approved.
- ✅ No approved decision reopened — Forms/Leads sibling nav, inline-only widget, CTA default, consent field, tenant branding, lead statuses, notification recipient, unpublishing behavior, hosted-page minimal-chrome decision, PostgreSQL all left untouched.
- ✅ No legacy feature promoted to requirement — legacy form _types_ (verified/smart/conversion_pro), pricing, per-form branding, and CRM terminology are explicitly excluded (§18).
- ✅ Forms and Leads remain separate modules, cross-linked not nested (§3, §13).
- ✅ OPS remains out of scope — no OPS screens anywhere in §5 (`PRODUCT_LANDSCAPE.md`, PRD-001 §4).
- ✅ Inline-only widget intact — §10 defines no popup/modal/slide-in.
- ✅ Hosted form remains supported and functionally equivalent, not a page-builder (§11); the CONFIRMED minimal-chrome decision from the prior revision is unchanged by this pass.
- ✅ Tenant-level branding intact, no per-form override anywhere (§17).
- ✅ Analytics remains out of scope — no counts/metrics on Forms List or Leads List (§6, §12).
- ✅ CRM remains out of scope — no assignment/ownership/pipeline/scoring/notes/tags/bulk actions/export in Leads UX (§12).
- ✅ No database/API implementation details introduced — screens and states only, no schema or endpoints (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §23 Non-Goals honored).
- ✅ Existing design-system tokens remain authoritative — §19 maps to existing primitives/composites against `docs/design-system/tokens.md` and `PLANNING_BASELINE.md` §10's confirmed component inventory; no new token values proposed.
- ✅ §19's remaining "NEW COMPONENT REQUIRED"/"still OPEN" entries stay labeled as recommendations/open implementation considerations, not approved implementation requirements.
- ✅ §6 "Last Updated" column remains labeled a UX recommendation / implementation dependency, not a confirmed data requirement.
- ✅ §12 Leads status filter remains explicitly OPEN/non-blocking and is not promoted to a V1 must-have.
- ✅ **This amendment's internal-consistency check (2026-08-22):** the Forms/Leads Admin nav-icon decision (§20a) is reflected consistently in §19 (component-mapping table row updated), §20 (open-questions item #5 narrowed, resolved-items note added), the Final Summary (Design-System Mapping and Recommended Next Step updated), and here. No other section references the prior "no icon additions are pre-authorized" framing in a way that still contradicts §20a. No product decision, screen, journey, data requirement, API contract, or IA element was reopened, expanded, or altered by this amendment — confirmed by re-reading §§1–18 and §21 against the nine sources above; none show any change other than the two nav-icon assignments and their consistency corrections.

**APPROVED — IMPLEMENTATION READY as of 2026-08-22; amended 2026-08-22 for the Forms/Leads nav-icon decision only.** No contradictions found against any of the nine authoritative/evidence sources, and the prior internal icon-authorization contradiction is resolved.

---

# FINAL SUMMARY

### CONFIRMED UX

- Forms/Leads sibling top-level Admin nav with cross-linking, not nesting.
- Six-type field set; CTA text-only with "Submit" default; optional Consent/Notice field.
- Draft → Published → Unpublished lifecycle; edits to Published forms take effect immediately; Publish requires ≥1 non-consent field.
- Public submission flow and its states, including opaque generic spam/abuse handling (never disclosed to visitor or Admin).
- Lead statuses New/Contacted/Closed, bidirectional; Leads filterable by source form.
- Tenant-level-only branding across Admin Preview, Widget, Hosted Page.
- Inline-only widget; functionally equivalent hosted page.
- **Hosted form page uses minimal public-page chrome: tenant logo/branding + the form only, with no Innovoot marketing navigation, promotional content, or unrelated Innovoot product chrome — scoped strictly to Forms V1, not a general website/page-builder decision.**
- **Forms Admin nav icon = existing `file-text`/document-form icon; Leads Admin nav icon = existing `user` icon. Both from the existing installed icon library; no new library, no other new icons (§20a).**

### UX RECOMMENDATIONS

- Forms List columns: Title, Status, and (as a UX recommendation / implementation dependency only, not a confirmed data requirement) Last Updated; no search/filter in V1.
- Leads List columns: Contact identifier, Source Form, Status, Date Received; an optional status filter is flagged OPEN/non-blocking (§20) and is explicitly **not** a V1 must-have.
- Explicit unpublish confirmation step (non-mandated safeguard).
- No interactive validation simulation required inside Form Preview.

### OPEN UX DECISIONS

See §20 — 4 items remain open and non-blocking (the Leads status-filter recommendation remains open and is not promoted to V1 scope; the former nav-icon item is RESOLVED — see §20a). (Former item #4, hosted-page minimal-chrome confirmation, was already RESOLVED — see §11.)

### SCREEN INVENTORY

See §5 — 14 screens/states total (8 Admin, 6 Public), all must-have, none speculative.

### USER JOURNEYS

See §4 — Business (create → publish → manage leads, including edit-while-published and unpublish/republish) and Public Visitor (submit → success/failure/unavailable), including non-happy-path states.

### STATE MATRIX

See §14 — 8 states (Loading, Empty, Validation error, Server error, Spam/abuse, Unpublished, Success, Processing), each with user-sees/can-do/recovery.

### DESIGN-SYSTEM MAPPING

See §19 — most needs map to existing primitives/composites; **3 gaps flagged as UX/design mapping recommendations for implementation planning** (data table, reorderable field-list editor, embed-snippet-with-copy) remain non-pre-approved; the Forms/Leads nav icons are now RESOLVED and implementation-approved per §20a; remaining icon needs (copy/clipboard, per-field-type icons) are still not pre-approved as implementation requirements — existing-component reuse must still be validated first, per `CLAUDE.md` §5.

### TRACEABILITY

See §21 — every UX decision mapped to its PRD-001/Data/API/UX-Principles/IA source section.

### CONSISTENCY CHECK

See §22 — no scope expansion, no reopened decisions, no legacy features promoted, all platform boundaries (OPS, CRM, analytics, per-form branding) intact; the Forms/Leads nav-icon amendment is internally consistent throughout.

### RECOMMENDED NEXT STEP

This UX Specification is **APPROVED — IMPLEMENTATION READY as of 2026-08-22**, amended 2026-08-22 for the Forms/Leads nav-icon decision. Proceed with the Claude Code implementation handoff, scoped strictly to what this document and its upstream approved sources (PRD-001, Forms V1 Data Requirements, Forms V1 API/Behavioral Requirements) define — including honoring the explicit non-required status of the "Last Updated" column, the Leads status filter, and the remaining §19 NEW COMPONENT REQUIRED / still-OPEN icon flags (copy/clipboard, per-field-type icons), none of which are pre-authorized for implementation by this approval. The **Forms/Leads Admin nav icons are the one exception**: per §20a, they are approved for implementation exactly as specified (existing `file-text` icon for Forms, existing `user` icon reused for Leads, no new icon library, no other new icons).

---

## Decision Log (Addendum — 2026-08-22)

| #   | Decision                                                                                       | Scope                                                                       | Approved by                     | Status                  |
| --- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------- | ----------------------- |
| A1  | Forms Admin nav icon = `file-text`/document-form icon from the existing installed icon library | Implementation detail of already-CONFIRMED Forms/Leads sibling nav (§3, §5) | Product Planning (this project) | APPROVED                |
| A2  | Leads Admin nav icon = reuse existing `user` icon                                              | Same as A1                                                                  | Product Planning (this project) | APPROVED                |
| A3  | No new icon library installed; no other new icons introduced                                   | Explicit scope boundary on A1/A2                                            | Product Planning (this project) | APPROVED                |
| A4  | Forms/Leads IA and product scope unchanged by A1–A3                                            | Confirms no side effects                                                    | Product Planning (this project) | CONFIRMED, not reopened |

---

_End of INNOVOOT — FORMS / LEAD CAPTURE V1 UX SPECIFICATION. **APPROVED — IMPLEMENTATION READY as of 2026-08-22; amended 2026-08-22.**_
