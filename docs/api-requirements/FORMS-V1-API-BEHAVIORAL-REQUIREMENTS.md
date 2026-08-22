# FORMS V1 — API / BEHAVIORAL REQUIREMENTS

**Status:** APPROVED — IMPLEMENTATION READY
**Type:** Behavioral/system requirements document (translates approved product decisions into backend guarantees). Not an API design document.
**Owner:** Innovoot Product Planning

**Authoritative sources:**

1. `docs/prds/PRD-001-FORMS-LEAD-CAPTURE-V1.md` — APPROVED, IMPLEMENTATION READY
2. `docs/data-requirements/FORMS-V1-DATA-REQUIREMENTS.md`
3. `docs/product/PRODUCT_LANDSCAPE.md`
4. `docs/product/PRODUCT_DEVELOPMENT_STRATEGY.md`
5. `docs/policies/DATA_PRIVACY_PRINCIPLES.md`
6. `docs/planning/PLANNING_BASELINE.md`

Legacy Admin and InnoForms documentation (`SYSTEM_FLOW.md`, `PROJECT.md`, `SHARED_RUNTIME_OWNERSHIP.md`, etc.) is evidence only and does not define any requirement in this document.

---

## 1. Document Status & Decision History

This document is derived entirely from PRD-001 (APPROVED — IMPLEMENTATION READY, 2026-08-22) and the Forms V1 Data Requirements. Where PRD-001 left something open (§33 items #5, #6, #8; phone format), that status is carried forward unchanged, not resolved here.

**Round 2 — behavioral questions resolved (this review cycle):**

| #   | Decision                                                                                                                                                                                                                                                                                                               | Closes                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| B1  | A Published Form may be edited by an authorized tenant user. Saved changes take effect **immediately** on both the embedded widget and hosted page — no unpublish/republish step required. Historical Submissions and Leads retain the data as originally submitted; editing a Form never rewrites historical records. | Previously OPEN item #6                                                   |
| B2  | A visitor must never see a successful submission state unless Lead creation has been confirmed. If Lead creation cannot be confirmed, the visitor receives the same generic submission-failure state used elsewhere. The technical mechanism for guaranteeing this consistency is not defined here.                    | Previously OPEN item #7                                                   |
| B3  | Lead status changes are bidirectional among New ↔ Contacted ↔ Closed. No pipeline/CRM behavior is introduced. Authorized tenant users may correct a status in either direction.                                                                                                                                        | Previously OPEN item #8                                                   |
| B4  | Forms V1 does not expose spam/abuse classification to Admin users, in addition to it never being exposed to the visitor. Internal technical recording of abuse detection (if any) is outside this product document.                                                                                                    | Previously OPEN item #9                                                   |
| B5  | A Form must contain at least one supported input field before it can be Published. The Consent/Notice checkbox alone does not satisfy this requirement.                                                                                                                                                                | New — replaces prior ASSUMPTION that a zero-field form could be published |

These are product-level behavioral decisions, not new product scope — none introduce a capability outside PRD-001's approved boundaries.

Status: **APPROVED — IMPLEMENTATION READY** (2026-08-22).

---

## 2. Purpose

PRD-001 and the Data Requirements define _what_ Forms V1 is and _what data_ it needs. This document translates those into the _behavioral guarantees_ the backend must satisfy — what must happen, in what sequence, under what conditions, and who is allowed to trigger it — without prescribing endpoints, schemas, or technology. The backend developer uses this as the behavioral contract when designing the actual PostgreSQL model and API.

---

## 3. Actors

| Actor                      | Description                                                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tenant Admin**           | Authenticated business administrator; full read/write on own tenant's Forms and Leads                                                                                                               |
| **Business Staff**         | Authenticated business staff user; per PRD-001 §24, ASSUMED equal read/write access to Forms and Leads as Admin in V1 (no granular permission tier exists yet — OPEN, see §24 of this document)     |
| **Public Visitor**         | Unauthenticated end user viewing/submitting a published form; no account, no login                                                                                                                  |
| **Notification Recipient** | The tenant's single configured notification email address; receives new-Lead notifications only, not a system actor with access rights                                                              |
| **Platform/OPS**           | No Forms/Leads-specific surface in V1 (explicitly out of scope per PRD-001). General platform-wide OPS access rules apply only if ever exercised (purpose-justified, auditable) — not designed here |

No additional roles are invented beyond this list.

---

## 4. Form Management Behaviors

### 4.1 Create Form

- **Actor:** Tenant Admin / Business Staff
- **Preconditions:** Actor is authenticated and tenant-resolved
- **Successful outcome:** A new Form is created in Draft state, owned by the actor's tenant, with a title
- **Validation failures:** Missing/invalid title
- **Authorization/isolation:** Form is bound to the creating actor's tenant only; no cross-tenant creation possible
- **Edge cases:** No limit on number of forms per tenant is defined by PRD-001 (multiple forms per tenant is explicitly supported)

### 4.2 Edit Form (title, fields, CTA text)

- **Actor:** Tenant Admin / Business Staff
- **Preconditions:** Form exists and belongs to actor's tenant
- **Successful outcome:** Form metadata/fields/CTA updated
- **Validation failures:** Invalid field configuration (e.g., unsupported field type — see §8)
- **Authorization/isolation:** Only the owning tenant's Admin/Staff may edit
- **Editing a Published form (CONFIRMED, decision B1):** A Published form may be edited in place. Saved changes become **immediately effective** on both the embedded widget and the hosted page — no unpublish/republish step is required. Historical Submissions and Leads are unaffected: they retain the field data as it existed at the time of submission, and editing a Form never rewrites historical records.

### 4.3 Configure Fields (add/edit field type, label, required flag)

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Field added/updated with type from the approved V1 set (§8), label, and required/optional flag
- **Validation failures:** Field type outside approved V1 set is rejected
- **Edge cases:** Consent/Notice field additionally requires configurable notice text (§4.6)

### 4.4 Reorder Fields

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Fields retain a stable, business-defined display order, respected on both public surfaces
- **Validation failures:** N/A (structural operation)

### 4.5 Configure Required/Optional

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Each field's required/optional status is set independently
- **Behavioral guarantee:** Required status drives both client-side and server-side validation (§9)

### 4.6 Configure CTA Text

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** CTA/submit button label set per form; defaults to "Submit" if not set
- **Constraint:** Text only — no styling configuration (styling is inherited from shared design system + tenant branding)

### 4.7 Configure Consent/Notice Field

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** An optional Consent/Notice checkbox field may be added to any form, with business-configured label/notice text and its own required/optional flag
- **Behavioral guarantee:** If added and marked required, a submission cannot succeed without it being affirmatively checked (§10, §13)
- **Constraint:** Does not introduce a legal-policy framework; behaves as a normal field whose value is a checkbox

### 4.8 Save Draft

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Form persists in Draft state, not publicly reachable

### 4.9 Publish

- **Actor:** Tenant Admin / Business Staff
- **Preconditions:** Form exists, belongs to actor's tenant
- **Successful outcome:** Form becomes Published; both an embed artifact and a hosted-page artifact become valid (business may use either, both, or neither)
- **Validation failures (CONFIRMED, decision B5):** A Form must contain **at least one supported input field** before it can be Published. A Consent/Notice checkbox alone does not satisfy this requirement — at least one non-consent input field must also be present. A Publish attempt on a Form with no fields, or with only a Consent/Notice field, must be rejected.

### 4.10 Unpublish

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Form becomes Unpublished. Existing embed snippets and hosted links remain technically valid (not broken/invalidated) but resolve to a "This form is no longer available" state for any visitor. Form record and history are retained, not deleted (§5).

### 4.11 View Form (Admin)

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Full form definition returned, scoped to actor's tenant
- **Authorization:** Cross-tenant view attempt must fail (§13)

### 4.12 List Forms

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** All forms belonging to actor's tenant, across all states (Draft, Published, Unpublished)
- **Authorization:** Never includes another tenant's forms

---

## 5. Form Lifecycle

**Draft → Published → Unpublished**

| Transition              | Meaning                       | Guarantee                                                                                                                                                                                                                                                   |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Created                 | Form starts in Draft          | Not exposed on widget or hosted page                                                                                                                                                                                                                        |
| Draft → Published       | Business explicitly publishes | Embed snippet and hosted URL become valid; both derive from the same Form definition; no separate configuration per surface                                                                                                                                 |
| Published → Unpublished | Business withdraws form       | Form record and its history are **retained, not deleted**. Existing embed snippets/hosted links remain technically valid but resolve to "This form is no longer available" for any visitor. Public _availability_ changes; the Form's _existence_ does not. |

- **Editing a Published form (CONFIRMED, decision B1):** allowed, and takes effect immediately on both public surfaces — see §4.2. No unpublish/republish step is required, and this does not alter the lifecycle states themselves.
- **Publishing requirement (CONFIRMED, decision B5):** a Form must contain at least one supported input field before it can transition Draft → Published; the Consent/Notice checkbox alone does not satisfy this.
- **What happens to visitors while a form is Unpublished:** they see a clear "no longer available" state, never a broken page or silent failure.
- Re-publishing after Unpublish is not explicitly addressed by PRD-001; **ASSUMPTION**: since the form record is retained, a business can transition Unpublished → Published again using the same underlying artifacts. Flagged as an assumption, not a confirmed decision.

---

## 6. Public Form Retrieval

For rendering on either public surface, the system must be able to supply, for a given Published form:

- Form identity (which form this is)
- The active, ordered list of fields
- Each field's label, type, and required/optional state
- CTA text (or the "Submit" default)
- Consent/Notice field configuration, if present (label/notice text, required flag)
- Tenant branding (logo, primary color)
- Published/Unpublished state, so the surface can render the form or the "no longer available" state accordingly

**Guarantee:** retrieval must resolve to the correct tenant and form context per request and must never leak another tenant's form data (§13).

**Guarantee:** an Unpublished or non-existent form must not return renderable field data to a public request — only the "no longer available" (or equivalent not-found) outcome.

---

## 7. Public Submission Behavior

Sequence:

1. **Visitor opens form** — public surface fetches current form definition (§6)
2. **Visitor enters data**
3. **Client-side validation** — required fields, field-type format checks run before submission is sent
4. **Submission** — visitor-entered data is sent for processing
5. **Abuse/spam protection** — submission is checked; mechanism undecided (§9 of PRD-001 §22), not defined here
6. **Server-side validation** — authoritative validation independent of client-side (§8)
7. **Successful storage** — a valid, non-spam submission is stored
8. **Lead creation** — exactly one Lead is created from the valid Submission, status New (§10)
9. **Notification** — tenant is notified at its single notification email (§12)
10. **Success response/state** — visitor sees a confirmation/success state

**Failure handling by stage:**

| Stage fails                                                               | Visitor sees                                                                                                                                    | Lead created?         | Notification sent?                             |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- |
| Client-side validation                                                    | Inline errors at offending field(s); entered valid values preserved                                                                             | No                    | No                                             |
| Server-side validation                                                    | Clear error state, no data loss for the visitor's entered values                                                                                | No                    | No                                             |
| Spam/abuse rejection                                                      | Generic message: "We couldn't submit your request. Please try again." (never discloses spam/abuse classification)                               | No                    | No                                             |
| Lead creation fails after valid+clean submission (CONFIRMED, decision B2) | Same generic submission-failure state as any other failed submission — the visitor never sees a success state unless Lead creation is confirmed | No                    | No                                             |
| Notification fails                                                        | Visitor unaffected — notification failure must not surface to the visitor at all                                                                | Yes (already created) | No, but this does not undo Lead creation (§12) |

---

## 8. Validation Requirements

### Client-side validation

- Required fields must have a value before submission is allowed to proceed
- Format-validated fields (Email; Phone once format is resolved — OPEN) checked before submission
- On failure: inline errors at the offending field(s); already-entered valid values are preserved, not discarded

### Server-side validation (authoritative — independent of client-side)

- Re-validates required fields and formats regardless of client-side outcome
- Rejects submissions referencing unknown/invalid field references (i.e., data that doesn't match the form's current field definition)
- Rejects submissions to a Draft or Unpublished form
- A validation-failed attempt does not create a Submission record, a Lead, or a notification

### Field-level validation

| Field type              | Validation requirement                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Text                    | Presence only if required; no format constraint                                            |
| Textarea/message        | Presence only if required; no format constraint                                            |
| Email                   | Must match valid email format                                                              |
| Phone                   | **OPEN — format expectations not defined by PRD-001** (see §24 of this document)           |
| Select/dropdown         | Value must be one of the business-defined options                                          |
| Consent/Notice checkbox | If present and required, must be affirmatively checked; if optional, may be left unchecked |

### Form-level validation

- Submission must target a Published form
- Submission must reference the form's current, active field set — not a stale/edited-away field configuration. Since edits to a Published form take effect immediately (§4.2, decision B1), a submission in flight against an old field configuration (e.g., a field removed moments earlier) must be validated against the **current** definition, not a cached one, and rejected if it no longer matches.

---

## 9. Spam / Abuse Behavior

- Spam/abuse protection is a **required** behavior for every public submission. The technical mechanism is explicitly not decided here (belongs to technical/API design).
- A submission classified as spam/abuse:
  - Must **not** create a Lead
  - Must **not** trigger a business notification
  - Must **not** disclose to the visitor that it was classified as spam/abuse
- Visitor-facing rejection message (fixed, generic): **"We couldn't submit your request. Please try again."**
- This message must be used regardless of the underlying detection mechanism, and must not vary in a way that reveals detection logic.
- **Admin visibility (CONFIRMED, decision B4):** Forms V1 does not expose spam/abuse classification to Admin users either. The Leads/Admin experience has no view into rejected or spam-flagged submissions in V1 — this is not merely a visitor-facing restriction. Any internal technical recording of abuse-detection outcomes is outside the scope of this product document.
- Whether a spam/abuse-flagged attempt is retained (e.g., for internal/audit purposes only, not Admin-visible) or discarded is **OPEN** (PRD-001 §33 item #5).

---

## 10. Submission → Lead Behavior

This is the core behavioral guarantee of Forms V1:

- **A Submission is valid** when it passes both client-independent server-side validation (§8) and spam/abuse checks (§9), against a Published form.
- **A Lead is created if and only if a Submission is valid.** There is no manual "promote to lead" step and no review queue in V1.
- **A failed submission (validation failure or spam/abuse rejection) never creates a Lead.**
- **Initial Lead status is always `New`.**
- **Relationship:** each Lead references exactly one source Form (and, conceptually, the Submission that produced it) and exactly one tenant. This is a strict one-to-one relationship between a valid Submission and a Lead in V1, because Forms is the sole Lead source.
- **Tenant attribution:** a Lead always attributes to the same tenant that owns its source Form — no exception.
- **If Lead creation fails** after a submission has otherwise passed validation and spam/abuse checks (CONFIRMED, decision B2): the visitor must **never** see a successful submission state unless Lead creation has been confirmed. If Lead creation cannot be confirmed, the visitor receives the same generic submission-failure state used for other submission failures. This is a hard behavioral guarantee — a "successful" visitor experience and a missing Lead must never coexist. The technical mechanism for guaranteeing this consistency (e.g., how success/failure is determined and communicated) is explicitly **not defined here**.
- **If notification fails:** this must **not** change the Lead creation outcome. A Lead that was successfully created remains created and available to the business inside Admin, regardless of whether the notification email was successfully delivered (§12).

---

## 11. Lead Management Behaviors

### 11.1 List Leads

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** All Leads belonging to actor's tenant
- **Filter:** by source Form (required capability per PRD-001 §31 AC)

### 11.2 View Lead Detail

- **Actor:** Tenant Admin / Business Staff
- **Successful outcome:** Full submitted field data, source form, timestamp, current status, and a status-update control

### 11.3 Status Transition

- **Actor:** Tenant Admin / Business Staff
- **Valid transitions (CONFIRMED, decision B3):** status changes are **bidirectional** among the three fixed statuses — `New ↔ Contacted ↔ Closed`. An authorized tenant user may move a Lead's status in either direction (e.g., `Closed → Contacted` to correct a mistaken close) at any time.
- **Constraint:** this remains a flat, three-status field with manual transitions only — no pipeline, no additional statuses, no automated transitions, no CRM behavior of any kind is introduced by allowing bidirectional movement.
- **Authorization:** Only the owning tenant's Admin/Staff may transition a Lead's status; no assignment/ownership concept exists in V1, so any authorized tenant user may update any of that tenant's Leads.

**Explicitly out of scope for V1** (do not build): assignment, ownership, pipeline, CRM behaviors, bulk actions, export, tagging, notes.

---

## 12. Notifications

- **Trigger:** exactly once, when a new Lead is created (i.e., only on a valid, non-spam submission)
- **Recipient:** the tenant's single, tenant-level notification email address (not per-form, not per-user)
- **Minimum information the notification must communicate:** that a new Lead was created, and enough reference to let the business locate it in Admin (e.g., which form it came from) — exact content/format is not specified here
- **Behavior if delivery fails:** must not affect Lead creation outcome (§10). The Lead remains created and visible in Admin regardless of notification delivery success.
- **Notification failure does not change the Lead creation outcome** — this is an explicit guarantee, not an assumption.

---

## 13. Tenant Isolation

Non-negotiable, platform-wide (DATA_PRIVACY_PRINCIPLES §4), restated here as it applies to Forms V1:

A tenant must never be able to:

- Retrieve another tenant's forms (Draft, Published, or Unpublished)
- Retrieve another tenant's submissions
- Retrieve another tenant's leads
- Modify another tenant's forms
- Modify another tenant's leads
- Submit data into another tenant's form context (i.e., a submission must always resolve to the correct owning tenant)

This guarantee applies equally to Admin-authenticated operations and public/unauthenticated operations. Public-facing retrieval and submission must resolve the correct tenant context per request without relying on the visitor being trustworthy.

---

## 14. Branding

- Public forms (both surfaces) use **tenant-level** branding only: one logo and one primary color, applied uniformly across all of a tenant's forms.
- **No per-form branding override** exists in V1.
- Admin configuration behavior: tenant branding is configured once at the tenant level (outside Forms itself — Forms consumes it, does not own it) and applies automatically to all of that tenant's forms without per-form action.

---

## 15. Hosted Form vs Embedded Widget

Both surfaces render the same Form definition. Required behavioral equivalence:

| Aspect              | Guarantee                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Fields              | Identical field set, order, labels, types                                                                                  |
| Validation          | Identical client- and server-side validation rules                                                                         |
| Submission behavior | Identical submission → Lead flow (§7, §10)                                                                                 |
| Lead creation       | Identical outcome — one Lead per valid submission, regardless of surface                                                   |
| Branding            | Identical tenant branding applied                                                                                          |
| Lifecycle state     | Both surfaces reflect the same Draft/Published/Unpublished state at all times — there is no surface-specific publish state |

No separate business logic is introduced per surface. The only confirmed surface-specific detail is presentation: the widget is inline-only in V1; the hosted page is a standalone page. Neither affects validation, submission, or Lead behavior.

---

## 16. Error & Failure Behavior

| Condition                         | Visitor-facing                                                                                                                         | Admin-facing                                                                                                                               | System/internal                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Invalid form (doesn't exist)      | Not-found / unavailable state                                                                                                          | N/A                                                                                                                                        | —                                                                                              |
| Unpublished form accessed         | "This form is no longer available"                                                                                                     | N/A                                                                                                                                        | —                                                                                              |
| Invalid field data                | Inline validation errors, entered valid values preserved                                                                               | N/A                                                                                                                                        | —                                                                                              |
| Spam/abuse rejection              | Generic: "We couldn't submit your request. Please try again."                                                                          | Not disclosed to Admin either (CONFIRMED, decision B4) — no spam/abuse-flagged submissions are visible in the Leads/Admin experience in V1 | Detection outcome not exposed publicly or in Admin                                             |
| Submission failure (system-level) | Clear error state, no data loss                                                                                                        | N/A                                                                                                                                        | Not defined here — technical concern                                                           |
| Lead creation failure             | Visitor sees the same generic submission-failure state as any other failed submission — never a success state (CONFIRMED, decision B2) | Not defined here — no Admin-facing requirement established                                                                                 | Mechanism for guaranteeing success is never shown without a confirmed Lead is not defined here |
| Notification failure              | Unaffected — visitor sees normal success state, since Lead creation already succeeded                                                  | Not required to be shown to Admin in V1                                                                                                    | Must not block or reverse Lead creation                                                        |
| Unauthorized Admin access         | N/A                                                                                                                                    | Access denied                                                                                                                              | —                                                                                              |
| Cross-tenant access attempt       | N/A (should not be reachable)                                                                                                          | Access denied — must fail closed                                                                                                           | Must never partially succeed                                                                   |
| Unexpected system failure         | Generic error, no sensitive/technical detail exposed                                                                                   | Generic error unless legitimately actionable                                                                                               | Not defined here — technical concern                                                           |

**Guarantee:** visitor-facing error messages never expose sensitive technical detail, internal classification (e.g., spam vs. validation), or another tenant's data.

---

## 17. Idempotency / Duplicate Submission Behavior

**OPEN — technical/API design consideration.**

PRD-001 and the Data Requirements do not establish a product requirement for protecting against accidental duplicate submissions (e.g., double-click, retry-on-timeout). This is not assumed to require a technical solution at the product level; it is flagged for technical/API design to evaluate, not introduced as new product scope here.

---

## 18. Privacy & Data Handling

Per DATA_PRIVACY_PRINCIPLES.md (authoritative) and PRD-001 §23:

- **Permitted data collection:** ordinary contact/lead data only — name, email, phone, message-type fields. No medical/health or other sensitive/special-category data may be intentionally collected; this is a design constraint on the field-type set (§8), not just a policy statement.
- **Consent/notice:** the system must support an optional Consent/Notice field so a business can present a notice at the point of collection where its form warrants it (§4.7). Forms does not mandate consent language or judge when consent is legally "applicable" — that stays with the business.
- **Tenant isolation:** mandatory, as stated in §13.
- **Access:** Lead/Submission data access is scoped to the owning tenant's Admin/Staff users only.
- **Deletion implications:** both tenant-level data deletion and individual Lead deletion must be supported as platform capabilities (DATA_PRIVACY_PRINCIPLES §8). Deleting a Lead is conceptually independent of deleting its originating Submission or Form — no cascading deletion behavior is assumed here. Permanent deletion follows applicable retention/legal requirements, which are themselves not yet defined.
- **Retention dependency:** exact platform-wide retention periods are undefined (DATA_PRIVACY_PRINCIPLES §7) — not a Forms V1 blocker, but a known dependency for later implementation. Retention of failed/spam-flagged submission attempts specifically is OPEN (§9 above; PRD-001 §33 item #5).
- **Privacy requests:** end-customer privacy requests ("what data do you have on me," "delete my data") must be supportable as a platform process; for V1 this is request-based/manual, not self-service in-product tooling.

---

## 19. Auditability

- Audit logging is required as a **platform capability**, not a Forms-specific one, covering: personal-data access, personal-data changes, personal-data deletion, administrative actions, and permission/access changes.
- Applied to Forms V1: Lead status changes and access to Lead/Submission data should be capturable consistent with this platform principle.
- **No audit-log table design or UI is required in V1** — the underlying capability to capture and attribute these events is the requirement; how it's surfaced is a separate, later decision.

---

## 20. Security Boundaries

Product/API-level behavioral expectations (technology not prescribed):

- **Tenant isolation** must be enforced at the data-access level, not only the UI level, for every operation (§13).
- **Authorization** must gate all Admin-facing operations (create/edit/publish forms; view/update Leads) to authenticated users of the owning tenant.
- **Validation** (§8) must be enforced server-side regardless of client-side checks, since public submission endpoints are inherently untrusted input.
- **Abuse protection** (§9) is required on all public submission behavior.
- **Sensitive information exposure:** error responses and rejection messages to the public must never reveal internal classification logic, other tenants' data, or technical implementation detail.

---

## 21. Data Visibility

| Data                                                | Public Visitor            | Tenant Admin                         | Business Staff                                                   | OPS                                                                                                        |
| --------------------------------------------------- | ------------------------- | ------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Form definition (Published)                         | Read-only, rendering only | Full read/write, own tenant          | Full read/write, own tenant (ASSUMED equal to Admin — OPEN, §24) | None in V1 (out of scope)                                                                                  |
| Form definition (Draft/Unpublished)                 | No access                 | Full read/write, own tenant          | Full read/write, own tenant                                      | None in V1                                                                                                 |
| Own submitted data (in-flight, before confirmation) | Own entry only, transient | N/A                                  | N/A                                                              | N/A                                                                                                        |
| Other visitors' Submissions                         | No access                 | Via resulting Leads, own tenant only | Via resulting Leads, own tenant only                             | None in V1                                                                                                 |
| Leads                                               | No access                 | Full read/write, own tenant          | Full read/write, own tenant (ASSUMED — OPEN, §24)                | None in V1                                                                                                 |
| Cross-tenant data (any kind)                        | No access                 | No access                            | No access                                                        | No access (general OPS rules apply only if exercised, purpose-justified and auditable — not designed here) |

Staff permissions relative to Admin remain **OPEN** per PRD-001 §24/§33 item #6 — not resolved as a granular tier in V1; treated as equal to Admin per the current ASSUMPTION.

---

## 22. Behavioral Acceptance Criteria

**Form management**

- Given a Tenant Admin, when they create a form with a title, then the form exists in Draft state for their tenant only.
- Given a Draft form with at least one supported input field, when the Tenant Admin publishes it, then both an embed artifact and a hosted-page artifact become valid.
- Given a Draft form with no fields, or with only a Consent/Notice field, when the Tenant Admin attempts to publish it, then the publish attempt is rejected.
- Given a Published form, when the Tenant Admin unpublishes it, then existing embed/hosted links remain technically valid but resolve to "This form is no longer available" for any visitor.
- Given a Published form, when the Tenant Admin edits its fields and saves, then the updated definition is immediately reflected on both the embedded widget and the hosted page, with no separate publish/republish action required.
- Given a Lead created before a Form edit, when the Form is later edited, then the existing Lead's stored field data remains exactly as originally submitted and is not rewritten by the edit.

**Public submission**

- Given a Published form, when a visitor submits valid data, then a Submission is recorded and a Lead is created with status `New`.
- Given a Published form with a required Consent/Notice field, when a visitor submits without checking it, then the submission is blocked with an inline error and no Lead is created.
- Given a Published form, when a visitor submits invalid data (missing required field or bad format), then the visitor sees inline errors, already-entered valid values are preserved, and no Lead is created.
- Given a Published form, when a submission is classified as spam/abuse, then no Lead is created, no notification is sent, the visitor sees only the generic rejection message, and no record of it appears anywhere in the Admin/Leads experience.
- Given an Unpublished or non-existent form, when a visitor attempts to submit, then the submission is rejected and no Lead is created.
- Given a submission that passes validation and spam/abuse checks, when Lead creation cannot be confirmed, then the visitor sees the same generic submission-failure state as any other failed submission — never a success state.

**Leads**

- Given a valid Lead-producing submission, when the Lead is created, then it is attributed to the correct source Form and tenant, with status `New`.
- Given a new Lead, when it is created, then the tenant's single notification email receives a notification, unless delivery fails — in which case the Lead still exists and is visible in Admin.
- Given an existing Lead, when a Tenant Admin/Staff updates its status among New, Contacted, and Closed in either direction, then the transition succeeds; other tenants' Leads are never visible or actionable.
- Given a Lead currently `Closed`, when a Tenant Admin/Staff sets its status back to `Contacted` or `New`, then the change succeeds (bidirectional correction is permitted).

**Isolation**

- Given any operation (Admin or public), when it targets a tenant/form/lead outside the authenticated tenant's ownership, then it fails and no data crosses tenant boundaries.

---

## 23. Non-Goals

This document explicitly does **not** define:

- PostgreSQL schema or tables
- SQL
- Endpoint URLs
- HTTP methods
- Request/response JSON schemas
- Authentication architecture/technology
- Implementation framework (Express/Nest/Fastify/etc.)
- Email provider
- Spam/abuse detection technology
- Database indexes
- ORM choice

---

## 24. Open Questions

Carried forward, non-blocking (per PRD-001 §33 and Data Requirements §32):

| #   | Question                                                                                                         | Status                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Phone field format expectations                                                                                  | OPEN — Phone format is intentionally deferred to technical/API design and must be resolved before phone validation is implemented. It does not block approval of this behavioral requirements document. |
| 2   | Retention of failed/spam-flagged submission attempts — kept for audit or discarded                               | OPEN — PRD-001 §33 item #5                                                                                                                                                                              |
| 3   | General Admin permission model (administrator vs. staff distinction) — does Forms/Leads need to anticipate this? | OPEN — PRD-001 §33 item #6; currently ASSUMED equal access                                                                                                                                              |
| 4   | Exact platform-wide retention periods                                                                            | OPEN — DATA_PRIVACY_PRINCIPLES §7, platform-wide                                                                                                                                                        |
| 5   | `forms` module does not yet exist in the Base Kit module list                                                    | OPEN — technical/architecture note, PRD-001 §33 item #8                                                                                                                                                 |

**Previously open items #6–#9 (editing Published forms; Lead-creation-failure handling; Lead status reversibility; Admin spam/abuse visibility) are now RESOLVED** — see §1 decisions B1–B4, and their reflected changes in §4.2, §5, §7, §9, §10, §11.3, §16, §22. They no longer appear as open items.

No new open questions were surfaced by this round. The 5 items above remain the complete set of open items carried into this document.

---

## 25. Traceability

| Section here             | PRD-001                                       | Data Requirements |
| ------------------------ | --------------------------------------------- | ----------------- |
| §4 Form Management       | §13, §14                                      | §5, §6, §8, §9    |
| §5 Form Lifecycle        | §14                                           | §11               |
| §6 Public Form Retrieval | §11, §12                                      | §4, §12, §19      |
| §7 Public Submission     | §15                                           | §22               |
| §8 Validation            | §13, §15                                      | §7, §22           |
| §9 Spam/Abuse            | §22                                           | §21               |
| §10 Submission → Lead    | §16                                           | §28, §29          |
| §11 Lead Management      | §17, §18                                      | §17, §18          |
| §12 Notifications        | §19                                           | §20               |
| §13 Tenant Isolation     | §24                                           | §24               |
| §14 Branding             | §20                                           | §19               |
| §15 Hosted vs Embedded   | §11, §12, §12.1                               | §12               |
| §18 Privacy              | §23                                           | §23, §30, §31     |
| §19 Auditability         | §23 (referencing DATA_PRIVACY_PRINCIPLES §12) | §23               |
| §21 Data Visibility      | §24                                           | §25               |
| §22 Acceptance Criteria  | §31                                           | —                 |
| §24 Open Questions       | §33                                           | §32               |

---

## 26. Consistency Check

Checked against PRD-001, Forms V1 Data Requirements, PRODUCT_LANDSCAPE, PRODUCT_DEVELOPMENT_STRATEGY, and DATA_PRIVACY_PRINCIPLES, including the five decisions (B1–B5) applied in this revision.

- **Editing Published forms (B1):** PRD-001 §14 confirms a Published form can be unpublished and that unpublishing is a retention behavior, not a deletion — it is silent on editing while Published. B1 fills that gap without contradicting §14: unpublishing behavior is untouched, and B1 adds that edits, when they do occur, take effect immediately. This is consistent with §12.1's requirement that both public surfaces always share one Form definition (no divergent copies) — an immediate-effect model is the only one consistent with "one source of truth per Form." No conflict.
- **Historical record integrity under B1:** Data Requirements §29 states a Submission is immutable once created. B1's rule that historical Submissions/Leads retain their original data is a direct restatement of that immutability, not a new commitment. No conflict.
- **Lead-creation-failure / no-false-success (B2):** No existing source defines this failure mode, so B2 does not contradict anything; it is additive and consistent with PRD-001 §16's premise that "every submission that passes validation and spam/abuse checks automatically becomes a Lead" — B2 clarifies what the visitor sees in the (previously undefined) case where that guarantee cannot be honored. No conflict.
- **Bidirectional Lead status (B3):** PRD-001 §17 states transitions are "manual" and fixes the three statuses New/Contacted/Closed, but never states transitions are forward-only. §7 Out of Scope table excludes "pipeline" and "CRM" as concepts, not directional movement between three fixed statuses. B3's bidirectionality does not introduce a pipeline, additional statuses, or automation, so it stays inside the excluded-scope boundary while resolving the ambiguity. No conflict.
- **Spam/abuse Admin invisibility (B4):** PRD-001 §21/§22 mandate that the _visitor_ never learns of spam/abuse classification; they are silent on Admin visibility. DATA_PRIVACY_PRINCIPLES contains no requirement that abuse-detection outcomes be surfaced to tenant users. B4 is consistent with the general spam/abuse principle (avoid coaching bad actors, keep detection logic opaque) extended to the Admin surface. No conflict. Note: B4 does not contradict DATA_PRIVACY_PRINCIPLES §12 (audit logging) — audit capability is a platform-level, non-UI requirement (§19 of this document); B4 only concerns what is shown in the Leads/Admin product surface, not whether an event is capturable at the platform audit layer.
- **Minimum one field to publish (B5):** No source previously addressed a minimum field count; PRD-001 §13 defines the Consent/Notice checkbox as an _addition_ a business may make to a form's other fields, implicitly presupposing the form already asks something substantive — B5 makes that presupposition explicit rather than introducing new scope. No conflict.
- **No new product scope introduced** by any of B1–B5 — each resolves an implementation-relevant ambiguity within PRD-001's existing boundaries (form editing, submission integrity, lead status correction, spam opacity, publish validity) rather than adding a capability.
- **No implementation detail introduced** — all five decisions are stated as guarantees ("changes become immediately effective," "status changes are bidirectional," "must contain at least one field"), not mechanisms.

**Overall: no contradictions found against PRD-001, Forms V1 Data Requirements, PRODUCT_LANDSCAPE, PRODUCT_DEVELOPMENT_STRATEGY, or DATA_PRIVACY_PRINCIPLES.**

---

### CONFIRMED BEHAVIORS

- Multi-form-per-tenant creation, editing (metadata/fields/CTA) including live edits to Published forms, Draft/Publish/Unpublish lifecycle
- **Editing a Published form takes effect immediately on both public surfaces; no republish step; historical Submissions/Leads are never rewritten (B1)**
- **A Form must have at least one supported input field to be Published; Consent/Notice alone does not qualify (B5)**
- Field set: Text, Textarea, Email, Phone (format open), Select, Consent/Notice checkbox — with order and required/optional per field
- Publishing yields both embed and hosted artifacts from one Form definition; unpublishing retains the record and shows "no longer available" without breaking links
- Public submission flow: client validation → spam/abuse check → server validation → storage → Lead creation → notification → success state
- **The visitor is never shown a success state unless Lead creation is confirmed; unconfirmed Lead creation yields the same generic failure state as other submission failures (B2)**
- Every valid, non-spam submission creates exactly one Lead with status New, attributed to its source Form and tenant
- **Lead status is bidirectional among New ↔ Contacted ↔ Closed, with no pipeline/CRM behavior introduced (B3)**
- **Spam/abuse classification is not exposed to Admin users, in addition to never being exposed to the visitor (B4)**
- Single tenant-level notification email; notification failure never reverses Lead creation
- Tenant-level-only branding, applied uniformly
- Full behavioral equivalence between embedded widget and hosted page
- Tenant isolation enforced at data-access level across all operations, public and authenticated

### ASSUMPTIONS

- Unpublished → Published re-transition is possible using the same retained artifacts
- Business Staff has equal read/write access to Forms/Leads as Tenant Admin (per PRD-001 §24 ASSUMPTION)

_(The prior assumption that a zero-field form could be published is now superseded by CONFIRMED decision B5 and removed.)_

### OPEN QUESTIONS

See §24 — the same 5 items carried forward from PRD-001/Data Requirements (phone format, spam-attempt retention, staff-vs-admin permission model, platform retention periods, `forms` module scaffolding), all non-blocking. The 4 items newly surfaced in the prior draft (editing published forms, Lead-creation failure, status reversibility, Admin spam visibility) are now resolved (B1–B4) and no longer open.

### NON-GOALS

See §23 — no schema, SQL, endpoints, HTTP methods, request/response shapes, auth architecture, framework, email provider, spam technology, indexes, or ORM. Decisions B1–B5 in this revision introduce no exceptions to this list.

### CONSISTENCY CHECK

No contradictions found against PRD-001, Forms V1 Data Requirements, PRODUCT_LANDSCAPE, PRODUCT_DEVELOPMENT_STRATEGY, or DATA_PRIVACY_PRINCIPLES. See §26 for the decision-by-decision check.

### APPROVAL STATUS

This document is **APPROVED — IMPLEMENTATION READY** as of 2026-08-22. All five behavioral ambiguities raised in the prior draft are resolved (B1–B5). Only the 5 pre-existing, explicitly non-blocking open items remain (§24) — none of which gate implementation, consistent with PRD-001's own implementation-readiness determination.

---

_End of FORMS V1 — API / BEHAVIORAL REQUIREMENTS. APPROVED — IMPLEMENTATION READY as of 2026-08-22._
