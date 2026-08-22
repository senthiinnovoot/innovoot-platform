# FORMS V1 — DATA REQUIREMENTS

**Status:** APPROVED — IMPLEMENTATION READY
**Traces to:** PRD-001-FORMS-LEAD-CAPTURE-V1.md (APPROVED — IMPLEMENTATION READY)
**Type:** Product data requirements (conceptual). Not a database design, not an API design.

---

## 1. Purpose & Relationship to PRD-001

This document translates PRD-001's product decisions into **conceptual data requirements** — what information the system needs to hold, why, who owns it, who can see it, and how it changes over time. It does not prescribe tables, keys, indexes, types, or endpoints. That translation belongs to a later technical design stage, owned by the backend developer, built on top of this document plus PLATFORM_ARCHITECTURE_RULES.md.

Every requirement below is traceable to a PRD-001 section (noted inline) or to DATA_PRIVACY_PRINCIPLES.md where PRD-001 defers to it.

---

## 2. Data Principles

| Principle                                                                                 | Source                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Form ≠ Submission ≠ Lead — three distinct conceptual entities, not one collapsed record   | PRD-001 §28                                            |
| Tenant data isolation is mandatory at the data-access level, not just UI                  | DATA_PRIVACY_PRINCIPLES §4, PRD-001 §24                |
| Only ordinary contact/lead data is collected — no medical/health or special-category data | DATA_PRIVACY_PRINCIPLES §17, PRD-001 §23               |
| Retention follows platform-wide defaults, not tenant-configurable in V1                   | DATA_PRIVACY_PRINCIPLES §7                             |
| Data export is out of scope for V1                                                        | PRD-001 §7 (Out of Scope), DATA_PRIVACY_PRINCIPLES §11 |
| No legacy schema, field, or table is assumed to carry forward                             | PROJECT authority rule                                 |

---

## 3. Tenant / Business Ownership

- Every Form, Submission, and Lead belongs to exactly one tenant.
- A tenant business (Admin experience: administrator or staff, per §24 assumption — equal access in V1) may only see and act on their own tenant's Forms, Submissions, and Leads.
- **Working product assumption:** Innovoot operates under a processor/tenant-controller model for this data, subject to legal review. This document does not make a final legal characterization (DATA_PRIVACY_PRINCIPLES §3).
- **CONFIRMED:** No cross-tenant visibility exists anywhere in Forms/Leads, including no partial or aggregate cross-tenant view in V1 (OPS surface explicitly out of scope, PRD-001 §4/§24).

---

## 4. Form — Conceptual Entity

A Form is the tenant's definition of what to ask visitors. It is authored in Admin and is the single definition rendered on both public surfaces.

**Lifecycle:** Draft → Published → Unpublished (see §11).

**Owned by:** the tenant business (Admin).
**Visible to:** the owning tenant's Admin users; publicly (read-only, rendering only) via widget/hosted page while Published.

---

## 5. Form Configuration Requirements

A Form needs to hold:

| Requirement                                       | Why                                                | CONFIRMED / ASSUMED / OPEN                  |
| ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------- |
| A title (business-facing label)                   | Identifies the form to the business in Admin lists | CONFIRMED (§13)                             |
| An ordered list of fields                         | Defines what's asked, in what order                | CONFIRMED (§13)                             |
| A CTA/submit button label, defaulting to "Submit" | Configurable per form, text only — no styling      | CONFIRMED (§13)                             |
| A publish state                                   | Governs whether the form is publicly reachable     | CONFIRMED (§14)                             |
| Association to exactly one tenant                 | Tenant isolation                                   | CONFIRMED (§24, DATA_PRIVACY_PRINCIPLES §4) |

Out of scope for V1 (explicitly, do not model): per-form branding, template selection, "single/multiple form mode" toggle, analytics counters on the Form itself.

---

## 6. Form Field Requirements

Each field within a Form needs:

| Requirement              | Why                                                |
| ------------------------ | -------------------------------------------------- |
| Field type               | Determines input behavior and validation (see §7)  |
| Label                    | Business-facing question text shown to the visitor |
| Required / optional flag | Drives client-side and submission validation       |
| Position/order           | Fields render in business-defined order (§8)       |

**Consent/Notice field additionally needs:** configurable notice/label text and its own required/optional flag (see §10).

---

## 7. Supported Field Types (V1)

| Field type              | Notes                                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text                    | Short free text                                                                                                                                                |
| Textarea/message        | Long free text                                                                                                                                                 |
| Email                   | Format-validated                                                                                                                                               |
| Phone                   | Format expectations = **OPEN** (carried from PRD-001 — not one of the three named open items, but format rules were never specified in PRD-001; flagging here) |
| Select/dropdown         | Fixed, business-defined option list                                                                                                                            |
| Consent/Notice checkbox | Optional field type, see §10                                                                                                                                   |

**Explicitly excluded from V1** (do not model): OTP/verified fields, file uploads, payment fields, conditional/smart fields, any medical/health-oriented field type.

---

## 8. Field Ordering & Required/Optional Behavior

- Fields must retain a stable, business-defined display order.
- Each field's required/optional status is set independently by the business at configuration time.
- On submission, a required field with no value is a validation failure (see §22); an optional field may be left empty without blocking submission.

---

## 9. CTA Configuration

- One CTA/submit label per Form, defaulting to "Submit" if not set by the business.
- No CTA styling data (color/size/shape) is needed — appearance is inherited from the shared design system and tenant branding (§19), not stored per form.

---

## 10. Consent/Notice Field

- **CONFIRMED (§13, §15):** an optional field type a business may add to any Form.
- Needs: business-configured label/notice text, and a required/optional flag (independent of other fields).
- If present and marked required, a Submission cannot be valid without it being affirmatively checked.
- Does **not** introduce a separate consent-record concept, legal-policy configuration, or audit trail beyond what §23/§30 already require for the Submission as a whole — it behaves as a normal field whose value happens to be a checkbox.

---

## 11. Form Lifecycle: Draft → Published → Unpublished

| State       | Meaning                                            | Data implication                                                                                                                                                                                                                             |
| ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft       | Form created, not yet publicly reachable           | Not exposed on widget or hosted page                                                                                                                                                                                                         |
| Published   | Publicly reachable via widget and/or hosted page   | Embed snippet and hosted URL become valid; both derive from the same Form definition                                                                                                                                                         |
| Unpublished | Business has withdrawn a previously published form | Form record and its history are **retained**, not deleted; existing embed snippets/hosted links remain technically valid but resolve to a "no longer available" state — the Form's public _availability_ changes, not the Form's _existence_ |

**CONFIRMED (§14):** unpublishing never invalidates or breaks existing snippets/links — this is a data-retention behavior, not a deletion.

---

## 12. Embedded Widget & Hosted Form Relationship

- Both the embedded widget and the hosted/shareable page render the **same** Form definition — there is one source of truth per Form, not two divergent copies.
- Neither surface needs its own separate configuration data; publish state and field/CTA definitions are shared.
- **CONFIRMED (§13):** V1 widget display mode is inline only. The rendering model should stay extensible for future display modes (popup/modal), but no additional data is needed to support that extensibility now — just an awareness that a future "display mode" attribute may be added later.

---

## 13. Submission — Conceptual Entity

A Submission represents one visitor's completed interaction with a Form, at a point in time.

**Created by:** the visitor, via a public surface (widget or hosted page).
**Owned by:** the tenant that owns the source Form.
**Lifecycle:** created once, **immutable** — a Submission is a point-in-time record of what was actually submitted; it is not edited afterward (§28).

---

## 14. Submission Data Requirements

| Requirement                                           | Why                                                                                  | CONFIRMED / ASSUMED / OPEN                                                                                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The Form it was submitted against                     | Attribution — a Submission must trace to its source Form and, through it, its tenant | CONFIRMED (§28, §31 AC: "attributed to its source form and tenant")                                                                                                             |
| The values entered for each field                     | This is the substance of the Submission                                              | CONFIRMED                                                                                                                                                                       |
| Timestamp of submission                               | Needed for lifecycle, retention, and notification triggering                         | **CONFIRMED** — fundamental to a Submission's identity as a point-in-time, immutable record (§13, §28) and a necessary input to retention (§26) and notification (§20) behavior |
| Outcome (accepted / spam-flagged / validation-failed) | Drives whether a Lead is created and whether the visitor sees success or error       | CONFIRMED (§21, §22) — see §21 for what happens to rejected attempts                                                                                                            |

**The public surface used for submission (embedded widget vs. hosted page) is not required to be stored as Submission data.** Analytics is out of scope for V1 (§7 Out of Scope) and no concrete operational requirement currently justifies this field. No replacement field is introduced.

**Important boundary:** a Submission that fails validation client-side, or that is flagged spam/abuse, does **not** need to be retained as a first-class Submission record for V1 business purposes — whether it's retained _at all_ (e.g. for audit) is Open Decision item #2 below (PRD-001 §33 item #5), carried forward unresolved (see §26).

---

## 15. Lead — Conceptual Entity

A Lead is the business-actionable record automatically derived from a valid Submission. Lead is a **reusable platform concept**, not owned by Forms (PRD-001 §1 decision 4) — Forms is its first source, but the concept is designed to outlive Forms as the only source.

**Created by:** the system, automatically, never manually by a user in V1.
**Owned by:** the tenant.
**Lifecycle:** New → Contacted → Closed (§17).

---

## 16. Submission → Lead Creation Relationship

- **CONFIRMED (§1 decision 3, §31 AC):** every _valid_ Submission automatically creates exactly one Lead.
- A spam/abuse-flagged or validation-failed Submission does **not** create a Lead.
- A Lead must provide the business with access to the submitted information needed to act on the Lead. Whether this information is stored directly on the Lead or accessed through its originating Submission is a technical data-model decision and is not specified here.
- **Relationship cardinality:** one valid Submission → exactly one Lead. A Form has many Submissions over time; a Form (via its Submissions) has many Leads.

---

## 17. Lead Lifecycle: New → Contacted → Closed

| State     | Meaning                                                |
| --------- | ------------------------------------------------------ |
| New       | Default state on creation                              |
| Contacted | Business has manually marked engagement with this Lead |
| Closed    | Business has manually marked this Lead as done         |

- **CONFIRMED (§1 decision 5, §31 AC):** transitions are manual, business-driven, and this is the complete state set for V1 — no additional states, no automatic transitions.
- **CONFIRMED (§1 decision 6):** no assignment/ownership concept exists in V1 — a Lead is not "owned" by an individual staff member, only by the tenant as a whole.

---

## 18. Lead Source Information

- Every Lead needs a traceable link back to the Form (and thus Submission) that produced it.
- **CONFIRMED (§31 AC):** the Leads module must support filtering by source form — meaning source-form attribution is a first-class requirement of the Lead, not an optional nicety.
- No other "source" concept exists in V1 — Forms is the only Lead source (§1 decision 9 area; multi-source Lead design is explicitly out of scope, §7 Out of Scope table: "Any Lead source other than Forms").

---

## 19. Branding Reference

- **CONFIRMED (§1 decision 10):** branding (logo, primary color) is **tenant-level only**. Per-form branding is out of scope.
- Forms/Submissions/Leads do not need to store any branding data themselves — public surfaces reference the tenant's existing branding data (wherever that already lives at the platform level), not a Forms-specific copy.

---

## 20. Notification Information

- **CONFIRMED (§1 decision 16 area / §19 area, closes Open Decision #4):** one tenant-level notification email address is used in V1; there is no per-form notification recipient.
- Requirement: the system needs to know, per tenant, a single email address to notify when a new Lead is created. This is tenant-level configuration, not Forms-specific or per-form data.
- A notification event conceptually needs: which Lead triggered it, and confirmation it was the tenant-level address (no per-form override to reconcile).

---

## 21. Spam/Abuse Outcome Information

- **CONFIRMED (§22):** a spam/abuse-flagged submission must not create a Lead and must not trigger a business notification.
- **CONFIRMED (§22):** the visitor always sees a generic rejection message ("We couldn't submit your request. Please try again.") that never discloses the spam/abuse classification.
- Data requirement: the system needs _some_ way to represent that a submission attempt was rejected as spam/abuse (distinct from a validation failure) so it can correctly suppress Lead creation and notification — but whether that rejected attempt is _retained_ for audit purposes, and for how long, is unresolved (§26, PRD-001 §33 item #5).
- The technical detection mechanism itself (honeypot, rate-limiting, CAPTCHA, etc.) is explicitly not a data requirement here — out of scope for this document.

---

## 22. Validation Requirements

- Required fields must have a value; format-validated fields (email, and phone once its format is resolved) must match expected format.
- **CONFIRMED (§31 AC):** on validation failure, the visitor sees inline errors at the offending field(s) without losing already-entered valid values — meaning the system (client-side) needs to preserve entered field values across a failed validation attempt. This is a UX/state requirement, not necessarily a requirement to persist anything server-side for a failed attempt.
- A validation-failed attempt does not create a Submission record, a Lead, or a notification.

---

## 23. Privacy / Data-Handling Requirements

Narrowed from DATA_PRIVACY_PRINCIPLES.md, per PRD-001 §23:

| Requirement                                                                                                                                                                                        | Status                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Only ordinary contact/lead data collected (name, email, phone, message-type fields)                                                                                                                | CONFIRMED                                                                                                             |
| No medical/health or special-category data collected, by field-type design                                                                                                                         | CONFIRMED                                                                                                             |
| Innovoot = processor, tenant = controller for this data                                                                                                                                            | Working product assumption, subject to legal review — not a final legal characterization (DATA_PRIVACY_PRINCIPLES §3) |
| Consent/notice supported via optional Consent/Notice field; Forms does not enforce when consent is legally "applicable"                                                                            | CONFIRMED                                                                                                             |
| Access to Lead/Submission data scoped to the owning tenant's Admin users only                                                                                                                      | CONFIRMED                                                                                                             |
| Audit logging of personal-data access/changes/deletion (e.g. Lead status changes) is a platform capability Forms data should be compatible with, without requiring a Forms-specific audit UI in V1 | CONFIRMED (principle-level; no UI needed)                                                                             |
| Exact retention periods                                                                                                                                                                            | OPEN — platform-wide, not resolved (DATA_PRIVACY_PRINCIPLES §7)                                                       |
| Children's data handling                                                                                                                                                                           | Not required for Forms V1's data scope (CONFIRMED — no special handling needed)                                       |

---

## 24. Tenant Isolation Requirements

- **CONFIRMED, non-negotiable:** no Form, Submission, or Lead is ever visible or actionable outside its owning tenant, under any role, in any experience (Admin or public).
- Public/widget-facing surfaces must resolve the correct tenant context per request; this is a platform-wide requirement (DATA_PRIVACY_PRINCIPLES §4), not something Forms defines independently.
- This applies to every conceptual entity in this document — Form, Submission, Lead — without exception.

---

## 25. Data Visibility Requirements by Role

| Role                           | Can see                                                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business administrator (Admin) | Own tenant's Forms (all states), Submissions (as reflected through Leads), Leads — full read/write on Forms and Leads                                                                                     |
| Business staff (Admin)         | Same as administrator in V1 — **ASSUMED** equal access (§24), no granular permission tier exists yet                                                                                                      |
| Visitor (public)               | Only the rendered Form itself while Published; never sees other visitors' Submissions, Leads, or any Admin data                                                                                           |
| OPS                            | No Forms/Leads-specific view in V1 (out of scope); general platform-wide OPS access rules apply if ever exercised, per DATA_PRIVACY_PRINCIPLES §6 — purpose-justified and auditable, not general browsing |

---

## 26. Data Retention Requirements & Unresolved Retention Questions

| Item                                                                               | Status                                                                              |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Forms, Submissions, Leads follow platform-defined retention defaults               | CONFIRMED (not tenant-configurable in V1)                                           |
| Exact retention periods (how long Submissions/Leads are kept)                      | **OPEN** — platform-wide, undecided (DATA_PRIVACY_PRINCIPLES §7)                    |
| Retention of failed/spam-flagged submission attempts — kept for audit or discarded | **OPEN** — PRD-001 §33 item #5, explicitly non-blocking for V1 build but unresolved |
| Unpublishing a Form does not delete it or its history                              | CONFIRMED (§14, §29)                                                                |

---

## 27. Data That MUST NOT Be Collected in Forms V1

- Medical/health or other special-category data of any kind.
- Any field type not in the approved V1 set (§7) — explicitly no OTP/verification data, no file uploads, no payment data, no conditional-logic-derived data.
- Per-form branding data.
- Lead assignment/ownership data (no such concept exists in V1).
- Any data attributable to a Lead source other than Forms.
- Analytics/telemetry data (views, submission counts, conversion rates) — explicitly deferred.

---

## 28. Data Relationships & Ownership — Conceptual Only

```
Tenant
  └── owns many Forms
         └── has many Submissions (over time)
                └── a VALID Submission produces exactly one Lead
  └── owns all Leads (via their source Form)
```

- Form : Submission = one-to-many.
- Submission : Lead = one-to-one (only for valid, non-spam submissions).
- Lead : Tenant = many-to-one (all Leads roll up to one tenant, never shared).
- No relationship exists between a Lead and an individual staff member (no assignment, §17).

---

## 29. Data Lifecycle

| Entity     | Created                                       | Changes                                          | Ends                                                                                                                     |
| ---------- | --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Form       | Business, in Admin                            | Draft ↔ Published ↔ Unpublished; field/CTA edits | Retained indefinitely unless explicit business/tenant deletion occurs (§30)                                              |
| Submission | Visitor, via public surface                   | Immutable once created — no edits                | Subject to platform retention defaults (OPEN, §26)                                                                       |
| Lead       | System, automatically from a valid Submission | Status only: New → Contacted → Closed            | Subject to platform retention defaults (OPEN, §26); individual Lead deletion is supported per DATA_PRIVACY_PRINCIPLES §8 |

---

## 30. Data Deletion Implications

- **CONFIRMED (DATA_PRIVACY_PRINCIPLES §8):** both tenant/business-level data deletion and individual Lead deletion are supported platform capabilities; permanent deletion follows applicable retention/legal requirements (themselves still open, §26).
- Deleting a Lead is conceptually independent of deleting its originating Submission or Form — this document does not assume cascading deletion behavior; that is a technical design decision to be made consistent with the platform's deletion principles, not specified here.
- Unpublishing a Form is explicitly **not** a deletion event (§11, §14).

---

## 31. Data Export Implications — Future Capability Only

- **CONFIRMED (§7 Out of Scope, DATA_PRIVACY_PRINCIPLES §11):** no data export capability is required or designed for Forms V1.
- No data requirement in this document should be read as implying export-readiness (e.g. no requirement to structure data for portability) — that is future, platform-wide work.

---

## 32. Open Data Questions

| #   | Question                                                                                                         | Traces to                  | Blocking?                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| 1   | Phone field format expectations                                                                                  | PRD-001 §13 field table    | Not blocking V1 build; needed before validation logic is finalized |
| 2   | Retention of failed/spam-flagged submission attempts — kept or discarded                                         | PRD-001 §33 item #5        | Not blocking V1 build                                              |
| 3   | General Admin permission model (administrator vs. staff distinction) — does Forms/Leads need to anticipate this? | PRD-001 §33 item #6        | Not blocking V1 — future-proofing only                             |
| 4   | Exact platform-wide retention periods                                                                            | DATA_PRIVACY_PRINCIPLES §7 | Not blocking V1 build; dependency for later implementation         |
| 5   | `forms` module does not yet exist in Base Kit module list                                                        | PRD-001 §33 item #8        | Technical/architecture note, not a data-requirements gate          |

---

## 33. Traceability Back to PRD-001

| This document's section          | PRD-001 source                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §4–§9 (Form)                     | §13, §14                                                                                                                                                                                                      |
| §10 (Consent/Notice)             | §13, §1 decision 15                                                                                                                                                                                           |
| §11 (Lifecycle)                  | §14, §29 (AC)                                                                                                                                                                                                 |
| §12 (Widget/Hosted relationship) | §1 decision 2, §13                                                                                                                                                                                            |
| §13–§14 (Submission)             | §15, §28. Timestamp: CONFIRMED, structural to point-in-time record. Source surface: explicitly excluded from V1 scope, not carried as an open item.                                                           |
| §15–§18 (Lead)                   | §1 decisions 3–6, 9, §28, §31 (AC). Lead's access to submitted data is a technical data-model decision, not fixed here as duplication or reference.                                                           |
| §19 (Branding)                   | §1 decision 10                                                                                                                                                                                                |
| §20 (Notification)               | §1 decision 20 (closes Open Decision #4)                                                                                                                                                                      |
| §21 (Spam/abuse)                 | §22, §1 decision 18 (closes Open Decision #2)                                                                                                                                                                 |
| §23–§24 (Privacy/Isolation)      | §23, §24, DATA_PRIVACY_PRINCIPLES §3–§9. Processor/controller framing restated as a working assumption subject to legal review, consistent with DATA_PRIVACY_PRINCIPLES §3 and §19 (Legal Review/Open Areas). |
| §26 (Retention)                  | §33 item #5, DATA_PRIVACY_PRINCIPLES §7                                                                                                                                                                       |
| §27 (Excluded data)              | §7 Out of Scope table                                                                                                                                                                                         |
| §32 (Open questions)             | §33 items #5, #6, #8 (carried forward unresolved, non-blocking)                                                                                                                                               |

**No conflicts found** between this document and PRD-001, PRODUCT_LANDSCAPE.md, PRODUCT_DEVELOPMENT_STRATEGY.md, or DATA_PRIVACY_PRINCIPLES.md. Everything here is either a direct restatement of a CONFIRMED PRD-001 decision, an explicitly labeled ASSUMPTION consistent with PRD-001's own assumptions, or an explicitly labeled OPEN item — none of which alter PRD-001's scope or reopen a closed decision.

---

### DECISIONS

None new — this document restates and structures existing PRD-001/privacy-policy decisions into data-requirement form. Nothing here has been decided independently.

### OPEN QUESTIONS

The 5 items in §32, inherited directly from PRD-001 §33 and DATA_PRIVACY_PRINCIPLES §7 — none blocking.

### NEXT STEP

Proceed to **FORMS V1 — API/BEHAVIORAL REQUIREMENTS** (product-level operation guarantees, not endpoint design), which the backend developer will use alongside this document to produce the PostgreSQL schema and API design.

---

_End of FORMS V1 — DATA REQUIREMENTS. APPROVED — IMPLEMENTATION READY._
