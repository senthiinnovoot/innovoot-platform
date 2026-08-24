# FORMS V2 — API BEHAVIORAL REQUIREMENTS

**Status:** **APPROVED — IMPLEMENTATION READY (as of 2026-08-24)**
**Type:** API behavioral contract (conceptual). Not a database design, not an endpoint/schema design, not implementation.
**Traces to (all unmodified, none reopened by this document):**

- `PRD-001-FORMS-LEAD-CAPTURE-V1.md` — APPROVED — IMPLEMENTATION READY
- `PRD-002-BILLING-ENTITLEMENTS-MINIMAL-V1.md` — APPROVED — IMPLEMENTATION READY
- `PRD-003-FORMS-ADVANCED-CAPABILITIES-V2.md` — APPROVED — IMPLEMENTATION READY (product-definition level)
- `FORMS-V1-DATA-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V2-DATA-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY (the V1 behavioral contract this document extends; its structure and unresolved items are inherited, not redefined)

---

## 1. Purpose

This document translates PRD-003's approved product decisions and `FORMS-V2-DATA-REQUIREMENTS.md`'s approved data shape into the **behavioral guarantees** the backend must satisfy for Forms V2 — what must happen, in what sequence, under what conditions, and who may trigger it — without prescribing endpoints, schemas, request/response payloads, or technology.

It does exactly what `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` did for V1, extended to the three V2 capabilities. It does **not** redefine V1 behavior; where V1 behavior is unchanged, this document references it rather than restating it.

Where an approved source document is silent on a specific API behavior, that behavior is marked **OPEN** here rather than invented. This document introduces no new product decisions.

---

## 2. Scope and V1/V2 Boundary

**In scope:** the API-level behavioral contract for the three V2 capabilities — OTP Verification, Multi-step Forms, AI Lead Qualification — and their interaction with entitlement enforcement, as approved in PRD-003 and `FORMS-V2-DATA-REQUIREMENTS.md`.

**Out of scope / explicitly not reopened:**

- Any V1 behavior not directly modified by a V2 capability. `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` remains the authoritative contract for Form CRUD, Draft/Publish/Unpublish lifecycle, base field types, public submission, spam/abuse handling, Lead management, notifications, and tenant isolation, except where a V2 capability explicitly adds a precondition (noted inline below).
- Billing's own API behavior (Plan, Subscription, Payment, Plan-Change Request, OPS Plan-assignment). This document only describes how Forms V2 **consumes** the Entitlement Service — it does not define the Entitlement Service's own contract, which belongs to a Billing API Behavioral Requirements document (not in scope here).
- Endpoint URLs, HTTP methods, request/response JSON, database schema/SQL, ORM/framework choice, OTP provider/session implementation, AI model/provider choice.

**Governing boundary rule (restated from PRD-003, not redefined here):** Forms V2 is additive. It does not create a second Form, Submission, or Lead API. Every V2 behavior below either (a) extends an existing V1 behavior with an additional precondition/step, or (b) is a wholly new behavior attached to the existing Form or Lead.

**V1 → V2 extension map:**

| V1 behavior (unchanged contract)                                                               | V2 extension                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create/Edit/Publish/Unpublish Form                                                             | Adds capability configuration (§6) and, when `multi_step_enabled`, adds publish validation (§13)                                                                        |
| Public Submission → validation → spam/abuse → storage → Lead creation → notification → success | Adds OTP verification as a precondition to Submission validity when active (§12); adds Step-aware field collection when multi-step is active (§13); unchanged otherwise |
| Submission → Lead (unconditional, exactly one Lead per valid Submission)                       | Unchanged. AI Qualification never gates this (§14)                                                                                                                      |
| Lead read/update (status New/Contacted/Closed)                                                 | Enriched, never replaced, by an optional AI Qualification Result (§14)                                                                                                  |

---

## 3. API Authority and Source Hierarchy

Per the project's Authority Rule, applied to this document specifically:

1. Explicit decisions already confirmed in PRD-003 §14 and `FORMS-V2-DATA-REQUIREMENTS.md`'s approval decisions
2. `PRD-001` (Forms V1) and `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` — unmodified, foundational, govern everything this document does not explicitly extend
3. `PRD-002` (Billing & Entitlements) — unmodified, the entitlement contract Forms V2 consumes and never redefines
4. `PRD-003` (Forms V2) — the product-level source for the three capabilities
5. `FORMS-V2-DATA-REQUIREMENTS.md` — the data shape this document's behaviors operate on
6. This document — fills in API-behavioral detail around the above; introduces no independent product or data decisions

**Hard constraint, repeated because it is the most consequential rule in this document:** Forms V2 never computes entitlement from a Plan name, tier label, or price. Every entitlement question Forms V2 asks is one of exactly three capability-scoped keys:

```
Billing:  Plan + Subscription State → Entitlement Service → Capability
Forms:    Capability entitlement     → Form capability behavior
```

Any API behavior that branches on a Plan name, price, or tier label instead of an entitlement key is a defect against PRD-003 and against this document.

---

## 4. Actors

Extends `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §3. No new human or system role is introduced beyond one addition:

| Actor                                                   | V1 role                                     | V2 addition                                                                                                                     |
| ------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Tenant Admin                                            | Full read/write on own tenant's Forms/Leads | Configures the three capabilities per Form, subject to entitlement; sees visible-but-locked state for capabilities not entitled |
| Business Staff                                          | ASSUMED equal to Admin (V1 §24, OPEN)       | Same open item, not resolved by V2 (PRD-003 §13)                                                                                |
| Public Visitor                                          | Views/submits Published forms               | Experiences OTP challenge and/or Step-based navigation when active on the Form; otherwise identical to V1                       |
| Platform/OPS                                            | No Forms-specific surface (V1 §4)           | Unchanged — no OPS Forms surface in V2 either; OPS's entitlement-related actions happen entirely inside Billing                 |
| **Entitlement Service** (new, system-to-system, non-UI) | N/A                                         | Authoritative resolver for all three capability keys. Forms V2 calls it; Forms V2 never overrides or re-derives its answer      |

---

## 5. Form Capability Configuration — General Behavior

Applies identically to all three capabilities (OTP, Multi-step, AI Qualification) before their capability-specific behavior in §12–§14.

### 5.1 Set Capability Enabled State

- **Request intent:** Tenant Admin/Staff turns a capability on or off for a specific Form.
- **Preconditions:** Form exists and belongs to actor's tenant. For OTP specifically, an additional precondition applies (§12.1).
- **Validation:** Target capability is one of the three defined keys (`forms.otp_verification`, `forms.multi_step`, `forms.ai_lead_qualification`). No other capability keys exist in V2.
- **Authorization:** Actor is an authenticated Admin/Staff user of the Form's owning tenant (unchanged from V1 §13).
- **Entitlement check:** A live call to the Entitlement Service for the specific capability key, at the moment of the enable attempt. Per PRD-002 §12.3, this check must be re-validated at save-time, not assumed from whatever state the editor loaded with.
- **State change:**
  - If entitled (Active): the Form's Capability Configuration flag (`otp_enabled` / `multi_step_enabled` / `ai_qualification_enabled`) is set to the requested value. No entitlement state is written into Forms — only the tenant's configuration intent.
  - If not entitled (Not available / Subscription inactive / Check failed): the enable attempt is rejected. The flag is not set to `true`. (Disabling a capability is not entitlement-gated — a tenant may always turn a capability off.)
- **Response behavior:** Reflects the resulting flag state and, on rejection, the reason category (Not available vs. Subscription inactive vs. Check failed — §9, §10), consistent with PRD-002 §12.1's requirement to distinguish these in messaging.
- **Error behavior:** A stale-permission save (entitlement lost between page load and save) is rejected, not silently accepted then later overridden (PRD-002 §12.3).
- **Side effects:** None beyond the flag write. Enabling a capability does not itself trigger any Submission-time behavior — that only occurs at actual point of use (§8).
- **Idempotency/concurrency:** Re-submitting the same enable/disable request with no intervening change is idempotent (same resulting flag state). Concurrent edits by two Admin/Staff sessions to the same Form's Capability Configuration are **OPEN** — no approved source defines last-write-wins vs. conflict detection for this case; flagged for technical/API design, consistent with how `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §17 treats similar concurrency questions as open.

### 5.2 Read Capability Configuration (Admin view / editor render)

- **Request intent:** Render the Form editor's capability panel, showing each of the three toggles.
- **Preconditions:** Form exists and belongs to actor's tenant.
- **Entitlement check:** A live call per capability key, on every render — never inferred from a cached Plan label (PRD-002 §12.1 "live, not cached"). This is a firm requirement, not a performance-driven optimization decision.
- **State change:** None (read-only).
- **Response behavior:** For each of the three capabilities, returns enough information to render visible-but-locked correctly (§10): the stored `enabled` flag, and the live entitlement state (Active / Not available / Subscription inactive / Check failed), distinguished per PRD-002 §12.1's copy rule.
- **Error behavior:** If the entitlement check itself fails for a given capability (State E), that capability's control renders as locked with a distinct "temporarily unavailable" state — never conflated with State B/C messaging (PRD-002 §12.1).
- **Idempotency/concurrency:** N/A (read-only).

---

## 6. Form Capability Configuration — Per Capability Summary

| Capability            | Entitlement key               | What "enabled" means                                                                                                                                                                          | Confirmed fallback when not entitled                                                                   |
| --------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| OTP Verification      | `forms.otp_verification`      | Two per-Form settings: `otp_enabled` (is OTP on at all) and `otp_required` (is verification mandatory once on — **CONFIRMED**, §12.3). `otp_required` only applies when `otp_enabled = true`. | Normal submission without verification (applies to the whole capability, regardless of `otp_required`) |
| Multi-step Forms      | `forms.multi_step`            | Form fields are presented across Steps rather than as a single step                                                                                                                           | Single-step base form                                                                                  |
| AI Lead Qualification | `forms.ai_lead_qualification` | A Category + Explanation is attached to each Lead after creation                                                                                                                              | Normal lead capture without qualification output                                                       |

**Note on OTP's two settings:** `otp_enabled = false` (Starter-equivalent behavior), `otp_enabled = true` + `otp_required = true` (Verified-equivalent behavior), and `otp_enabled = true` + `otp_required = false` (Smart-equivalent behavior) are three distinct, valid configurations of the same two independent flags. No Experience Type, Form Type, or tier value is stored or checked anywhere — this is descriptive shorthand only, not a data or API concept.

---

## 7. Entitlement Checking

- **What is checked:** exactly one of the three capability keys per check — never a Plan name, tier label, or price (PRD-003 §11, hard constraint).
- **Who initiates the check:** Forms V2, as a caller of the Entitlement Service (PRD-002 §14.7/§15.1). Forms V2 does not implement its own entitlement resolution logic.
- **What the check must distinguish (five states, inherited verbatim from PRD-002 §10.1, not redefined here):**

| State                             | Meaning                                                | Forms V2 behavior                                                                                               |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| A — Active                        | Tenant is entitled now                                 | Capability functions                                                                                            |
| B — Not available                 | Plan never included this capability                    | Capability locked; "not included in your plan" / upgrade-toward messaging                                       |
| C — Subscription inactive         | Plan would include it, but subscription lapsed         | Capability locked; "reactivate" messaging, distinct from B                                                      |
| D — Downgrade while in active use | Tenant had it, used it, lost it via plan change        | Immediate disable of the capability with its defined fallback (§11); Form itself remains available              |
| E — Check failed                  | The check itself errored (timeout, dependency failure) | **Fail closed** — treated as not-entitled; distinct "temporarily unavailable" messaging, never B/C wording (§9) |

- **What Forms V2 must never do:** cache an entitlement result and treat it as authoritative for a subsequent point-of-use decision. Every point of use performs its own live check (§8).

---

## 8. Entitlement Enforcement at Point of Use

**Firm enforcement principle (PRD-002 §10.1, restated for V2, not reinterpreted):** the entitlement check for each capability must be enforced at every point where that capability actually takes effect — not only at Admin configuration time. For the three V2 capabilities, this means:

| Capability            | Enforcement points                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| OTP Verification      | Admin configuration (§5.1); widget/hosted-page rendering (does the OTP challenge appear); the OTP-send call itself, at public submission time |
| Multi-step Forms      | Admin configuration; widget/hosted-page rendering (does Step-based navigation appear); Publish-time validation (§13.4)                        |
| AI Lead Qualification | Admin configuration; the point immediately after Lead creation, when qualification would run (§14)                                            |

A capability that was entitled when the Form was last edited but is not entitled at the moment of actual use must behave as not-entitled at that moment — this is what makes a downgrade take effect for real visitors immediately, not only after the tenant next edits the Form (PRD-002 §10.1).

---

## 9. Visible-but-Locked Behavior

Applies identically to all three capabilities, inherited from PRD-002 §10.2/§12.1 and reused without modification by PRD-003 §11:

- A capability's control is **always rendered** in the Admin capability panel — never conditionally removed based on plan.
- When not entitled, it is visually distinguished (locked/disabled state) with a plain-language reason that distinguishes State B ("not included in your plan," upgrade-toward path) from State C ("your subscription is inactive," reactivate path).
- Visible-but-locked is a **display state only**. It has no bearing on enforcement — the real entitlement check at every point in §8 is what actually blocks use. A control that looks locked but isn't actually blocked (e.g., a client-side-only lock) is a defect, not an acceptable edge case.
- Every locked instance links to Plan Overview / the reactivation equivalent — never a dead end.

---

## 10. Fail-Closed Behavior

- If an entitlement check cannot resolve an answer (timeout, dependency failure, bad data — State E), Forms V2 must treat the capability as **not-entitled**, for every enforcement point in §8. Never fail open, under any circumstance.
- A fail-closed outcome disables only the affected capability, not the whole Form — the safe fallback for that capability (§6) applies, and the rest of the Form's V1 behavior is unaffected.
- Messaging must distinguish State E from State B/C (§9) so a paying tenant is not told they lack a capability they actually pay for because of a transient fault.

---

## 11. Downgrade and Entitlement Restoration

- **Sequence on downgrade:** Plan change → entitlement becomes inactive (State D) → the affected capability is immediately disabled at every enforcement point in §8 → the Form itself remains available, running on its safe fallback for that capability (§6). The whole Form is never taken down by a capability-level downgrade.
- **No data write on downgrade.** The stored `enabled` flag on the Form's Capability Configuration is **not** reset to `false`. It remains whatever the tenant last set it to; the live entitlement check alone determines whether the capability actually functions.
- **Restoration is automatic.** The moment the live entitlement check begins returning Active again, the capability resumes functioning under the same unchanged `enabled = true` flag. No tenant action and no data write are required to restore it.
- **Downgrade notice (inherited from PRD-002 §12.2, required behavior, mechanism open):** on the tenant's next Admin session after a downgrade disables one or more capabilities, the tenant must see a notice of what was disabled, on which Form(s), and when. Forms V2 requires no new audit/event log to satisfy this — "which Forms" is queryable live (every Form currently showing `enabled = true` for the affected capability) and "when" is sourced from Billing's own Subscription State effective-since timestamp (PRD-002 §14.4). Exact delivery mechanism (banner/notification-center/email) is **OPEN**, per PRD-002 §12.2.
- **Mid-edit entitlement loss:** if a tenant's entitlement changes while they are actively editing a capability's configuration, the save action must re-validate entitlement at save-time (§5.1), not rely on the state the editor loaded with.

---

## 12. OTP Behavior and Phone-Field Prerequisite

### 12.1 Enable OTP Verification

- **Request intent:** Tenant Admin/Staff turns OTP verification on for a Form.
- **Preconditions:** Form exists, belongs to actor's tenant, **and contains at least one Phone-type field** (`FORMS-V2-DATA-REQUIREMENTS.md` §C.2, hard precondition — OTP verifies a phone number already collected via V1's existing Phone field type; no new field type is introduced).
- **Validation:** If the Form has no Phone-type field, the enable attempt is rejected and the tenant must be told why (the precondition, not a bug) — required behavior; exact wording is a UX-stage detail (OPEN).
- **Authorization:** Per §5.1.
- **Entitlement check:** `forms.otp_verification`, per §7.
- **State change:** `otp_enabled` set to `true` only if both the Phone-field precondition and the entitlement check pass.
- **Response behavior / Error behavior:** As in §5.1, plus the Phone-field-precondition-specific rejection above.
- **Side effects:** None beyond the flag write.
- **Idempotency/concurrency:** As §5.1. Additionally: if the Phone-type field is later deleted from a Form that has OTP enabled, the resulting behavior is **OPEN** — no approved source states whether this auto-disables OTP, blocks the field deletion, or leaves OTP enabled-but-inert. Flagged for the next planning pass or technical/API design.

### 12.2 OTP at Public Submission Time

- **Request intent:** A visitor submits a Form with OTP verification active.
- **Preconditions:** Form is Published; `otp_enabled = true`; entitlement `forms.otp_verification` is Active (live check, §8).
- **Validation:** When `otp_required = true` (§12.3), a verified phone number is an **additional precondition to Submission validity**, layered on top of V1's existing validation (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §8) — it does not replace or change any V1 validation rule. When `otp_required = false`, verification is offered but a Submission may still be valid without it — the visitor-facing mechanics of an optional verification step are OPEN (§12.3).
- **Authorization:** N/A (public, unauthenticated, per V1).
- **Entitlement check:** Re-validated at the point of the OTP-send call itself (§8) — not only at whatever state the widget last cached.
- **State change:** A Submission is not valid until the phone number has been verified, when OTP is active. This mirrors V1's rule that a Submission is valid only once it passes all applicable checks (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §10).
- **Response behavior:** If entitlement is not Active at submission time (e.g., downgrade occurred after the Form was configured), OTP falls back to its confirmed safe fallback — normal submission without verification (§6, PRD-002 §11.1) — rather than blocking the visitor.
- **Error behavior:** OTP send/verify failure handling (retries, code expiry, provider errors) is **explicitly out of scope** — `FORMS-V2-DATA-REQUIREMENTS.md` §C.2 excludes "OTP provider/session/verification-implementation data" from this planning layer entirely. Only the behavioral guarantee above (verified phone as a Submission-validity precondition, when active and entitled) is defined here.
- **Side effects:** None beyond what V1 already defines for a valid Submission (storage → Lead creation → notification).
- **Idempotency/concurrency:** OTP send/verify session mechanics (rate limiting, resend, replay protection) are implementation detail, **OUT OF SCOPE** for this document, consistent with the data requirements exclusion above.

### 12.3 OTP Requiredness Sub-Setting — **CONFIRMED**

Resolved (previously OPEN at PRD-003 §15 #1 and `FORMS-V2-DATA-REQUIREMENTS.md` §E #3): OTP has **two independent per-Form settings**, not one:

- `otp_enabled` — whether OTP verification is turned on for the Form at all (§12.1).
- `otp_required` — whether, given `otp_enabled = true`, a verified phone number is **mandatory** for Submission validity, or merely **available/optional**.

`otp_required` has no meaning and is not evaluated when `otp_enabled = false`.

- **Request intent:** Tenant Admin/Staff sets `otp_required` for a Form that already has (or is concurrently setting) `otp_enabled = true`.
- **Preconditions:** Same as §12.1 (Form exists, belongs to actor's tenant, has ≥1 Phone-type field) **plus** `otp_enabled = true` — attempting to set `otp_required` on a Form where `otp_enabled = false` is rejected (or, if submitted together in one save action, is only meaningful once `otp_enabled` is confirmed `true` in the same operation).
- **Validation:** `otp_required` is a boolean; no third state.
- **Authorization:** Per §5.1.
- **Entitlement check:** No separate entitlement key. `otp_required` is a sub-setting of the single `forms.otp_verification` entitlement (§7) — it does not introduce a second gated capability. If `forms.otp_verification` is not Active, neither `otp_enabled` nor `otp_required` can be set to a functioning `true` state (§10, §11 fallback applies to the whole OTP capability, not per sub-setting).
- **State change:** `otp_required` stored alongside `otp_enabled` in the Form's Capability Configuration.
- **Response behavior:** Reflects the resulting `otp_enabled`/`otp_required` pair.
- **Error behavior:** As §5.1/§12.1.
- **Side effects:** At public submission time (§12.2), `otp_required = true` makes phone verification a hard precondition to Submission validity (submission fails without it, per V1's "valid if and only if" rule, `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §10). `otp_required = false` means verification is offered/available but a Submission may still be valid without it — the exact visitor-facing presentation of an optional verification step (e.g., a skip action) is **OPEN**, non-blocking, UX-stage, since no approved source defines the optional-path UI.
- **Idempotency/concurrency:** As §5.1.

**What this does not do:** it does not create a Form Experience Type, Form Type, or tier enum. `otp_enabled` and `otp_required` remain two independent booleans on the existing Form Capability Configuration — the same data shape pattern as `multi_step_enabled` and `ai_qualification_enabled`, just with OTP additionally carrying a requiredness sub-flag. Nothing labels a `{otp_enabled, otp_required}` combination as "Verified" or "Smart" anywhere in the API or data layer; any such labeling remains a UX-presentation choice, not a stored or checked value.

---

## 13. Multi-Step Behavior

### 13.1 Steps and Existing Form Fields

- Steps are a persistent V2 concept attached to the Form. **Fields remain children of Form exactly as V1 defines them** — Steps reference existing Fields; they do not own, replace, or become the Fields' parent (`FORMS-V2-DATA-REQUIREMENTS.md` §C.3, firm boundary).
- A Field's relationship to Form is unchanged whether or not the Form uses Steps.

### 13.2 Configure Steps (create/reorder/assign fields)

- **Request intent:** Tenant Admin/Staff creates Steps, orders them, and assigns existing Form Fields to a Step (with field order within the Step).
- **Preconditions:** Form exists, belongs to actor's tenant; `multi_step_enabled` reflects tenant intent (Steps may be authored regardless of current entitlement state — configuration is not itself entitlement-gated per §5.1's "disabling is always allowed" logic extended to authoring, though this specific case — authoring Steps while not entitled — is **OPEN**, not explicitly addressed by any approved source).
- **Validation:** Step order must be deterministic; field order within a Step must be deterministic (`FORMS-V2-DATA-REQUIREMENTS.md` decision #6).
- **Authorization:** Per §5.1.
- **State change:** Step created/reordered; Field-to-Step association updated.
- **Side effects:** **Deleting a Step must never delete the underlying Fields it referenced** — only the Step↔Field association is removed (`FORMS-V2-DATA-REQUIREMENTS.md` §C.8, firm boundary).
- **Idempotency/concurrency:** Re-ordering to the same resulting order is idempotent. Concurrent Step edits by two sessions: **OPEN**, same as §5.1.

### 13.3 Multi-Step at Public Submission Time

- **Request intent:** A visitor progresses through a Form's Steps and submits.
- **Preconditions:** Form is Published; `multi_step_enabled = true`; entitlement `forms.multi_step` is Active (live check, §8).
- **Validation:** Unchanged from V1 per-field validation (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §8); Steps are a presentation-layer grouping, not a new validation concept.
- **State change:** **Submission remains one atomic event, per V1** (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §10) — multi-step does **not** create multiple Submissions, one per Step or otherwise. The Step structure governs presentation/navigation only.
- **Response behavior:** If entitlement is not Active at submission time, multi-step falls back to its confirmed safe fallback — the Form presents as a single-step base form (§6, PRD-002 §11.1).
- **Error behavior:** As V1 §8/§9 for field-level validation and spam/abuse — unchanged, applied across whichever Step surfaced the offending field.
- **Idempotency/concurrency:** In-progress Step navigation state (what a visitor has filled in across Steps before final submit) is **OPEN** — no approved source defines whether/how partial progress is persisted between Steps; not assumed here.

### 13.4 Multi-Step Publish Validation

- **Request intent:** Tenant Admin/Staff publishes a Form that has `multi_step_enabled = true`.
- **Preconditions:** Form exists, belongs to actor's tenant.
- **Validation (CONFIRMED product rule, `FORMS-V2-DATA-REQUIREMENTS.md` decision #6, §C.8):** when `multi_step_enabled = true` at publish time —
  1. the Form must contain at least one Step;
  2. every Field intended for the published Form must belong to exactly one Step;
  3. Step order must be deterministic;
  4. Field order within each Step must be deterministic.
     A Publish attempt failing any of these is rejected. This is layered on top of V1's existing publish validation (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §4.9, decision B5: at least one supported input field, Consent/Notice alone insufficient) — both rules apply together when multi-step is active.
- **Authorization:** Per V1 §4.9.
- **Entitlement check:** `forms.multi_step` Active, per §8 (Publish is an enforcement point for this capability).
- **State change:** Form becomes Published, same as V1.
- **Error behavior:** Rejection reason distinguishes which rule failed (no Steps / unassigned Field / entitlement not Active) — exact response shape is **OPEN** (implementation detail, not defined here).
- **Side effects:** None beyond V1's existing Publish side effects (embed + hosted-page artifacts become valid).
- **Idempotency/concurrency:** As V1 §4.9 — no additional requirement identified.

---

## 14. AI Lead Qualification

### 14.1 Qualification Timing and Trigger

- **Request intent:** After a valid Submission produces a Lead (V1, unconditional), AI Qualification runs against the submitted Lead/Form data.
- **Preconditions:** `ai_qualification_enabled = true` on the source Form; entitlement `forms.ai_lead_qualification` is Active (live check) **at the time qualification would run**.
- **Sequence (firm, not reinterpreted):** Submission created → Lead created (V1, unconditional) → AI qualification runs against the created Lead/Form data → Category + Explanation attached to the Lead. Qualification is strictly **after** Lead creation and is **never** a gate on it.
- **Validation:** No additional visitor-facing input in V2 — input is the existing submitted Form/Lead data only. No new visitor-facing AI questions.
- **Authorization:** N/A for the qualification run itself (system-triggered, not actor-initiated). Reading the result is gated as any other Lead data (§18).
- **Entitlement check:** As above — entitlement failure here is Scenario A (§14.3), distinct from an AI runtime failure (Scenario B).
- **State change:** A Lead gains 0 or 1 AI Qualification Results (existence/absence only — no separate "pending/never ran/failed" state model, per `FORMS-V2-DATA-REQUIREMENTS.md` decision #4).
- **Response behavior:** The Category and Explanation, when present, must be clearly labeled AI-generated and shown together — the Explanation is never hidden behind an extra click (PRD-003 §12, CONFIRMED).
- **Side effects:** None on the Lead's core identity, status, or the Submission→Lead relationship.
- **Idempotency/concurrency:** Re-running qualification for the same Lead (e.g., a retried background job) — whether this overwrites, is rejected as a duplicate, or is simply not addressed — is **OPEN**. No approved source defines qualification-run idempotency.

### 14.2 Qualification Category and Explanation

- **Output, exactly:** a **Qualification Category** (business-defined value; exact set e.g. Qualified / Needs Review / Low Priority is **OPEN**, non-blocking, deferred to UX/Data stage) plus a short **AI-generated Explanation**.
- **Explicitly excluded, hard constraint:** no numeric score, confidence percentage, confidence meter, confidence ranking, or any equivalent quantitative mechanism, under any framing (`FORMS-V2-DATA-REQUIREMENTS.md` decision #9; PRD-003 decision #16). This is what keeps AI Qualification from reopening V1's confirmed exclusion of "scoring" from Lead Detail/List.
- **Firm downstream boundary (PRD-003 decision #19):** the Category must remain an AI-generated qualification result. It must not be turned into a generic CRM tagging feature or a manual/admin-editable tagging system.
- **Human override/correction of the Category:** **OPEN** (PRD-003 §15 #9) — not addressed by any approved decision.

### 14.3 AI Runtime Failure Must Not Prevent Lead Creation

Two distinct failure scenarios, kept separate per PRD-003 §10.3 — do not conflate them:

| Scenario                           | Trigger                                                                                   | Behavior                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A — Entitlement failure**        | Not entitled, lapsed, or the entitlement check itself failed                              | AI capability unavailable; Lead is captured normally, without qualification. Governed by §6/§10/§11's fallback rules — identical treatment to OTP's and multi-step's entitlement fallback.                                                                                                                               |
| **B — AI runtime/service failure** | Capability **is** entitled, but the AI service itself fails, times out, or is unavailable | Lead is captured normally; the qualification result is simply unavailable for that Lead. **This must never block Form submission or Lead creation.** This is a capability-specific runtime guarantee, distinct from — and not a redefinition of — PRD-002's entitlement fail-closed rule, which governs Scenario A only. |

In both scenarios, exactly one Lead is still created per valid Submission (V1's unconditional rule, unchanged) — the absence of a qualification result never affects whether the Lead exists.

### 14.4 Lead Integration

- No second Lead type, no new Submission type, no separate AI Lead entity is introduced. The existing V1 `Form → Submission → Lead` model is extended, not parallel-built (PRD-003 decision #18).
- Where the Category/Explanation are surfaced in the Lead UI (Lead Detail vs. list vs. a dedicated panel) is **OPEN** — non-blocking, deferred to UX Specification stage (PRD-003 §12, §15 #5/#8).

---

## 15. Plan/Capability Visibility Integration with Billing

- Forms V2 provides a Forms-facing entry point into the tenant's current Plan/capability state (PRD-003 §10.4) — this is a **display and navigation surface only**.
- **Hard exclusion, repeated for emphasis:** Forms must not own, store, or independently compute Plan, pricing, payment, or subscription data. This entry point composes Billing-sourced Plan/entitlement information (read live via Billing's own contract) with Forms' own per-capability `enabled` flags at render time — **no new Forms-side data is created to support this** (`FORMS-V2-DATA-REQUIREMENTS.md` §C.6, CONFIRMED as a no-new-data screen).
- Requesting or completing a Plan change is entirely Billing's flow — Forms V2 links out to it and does not act on Plan/payment data directly (PRD-003 §13).
- No `forms.tier_selection_ui` (or equivalent) entitlement key exists — Plan/Tier selection is not itself an entitlement-gated Forms capability (PRD-003 decision #6).

---

## 16. Form Lifecycle Compatibility with V1

| V1 lifecycle behavior                                                                                               | V2 compatibility                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Draft → Published → Unpublished states                                                                              | Unchanged. No new Form state is introduced by any V2 capability.                                                                                                                                                                                                                                                                                                                                                                              |
| Editing a Published Form takes effect immediately, no republish step (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` B1) | **CONFIRMED, extended to Capability Configuration and Steps.** Per your explicit confirmation: edits to a Published Form's Capability Configuration (`otp_enabled`, `otp_required`, `multi_step_enabled`, `ai_qualification_enabled`) and Steps take effect immediately, with no republish step and no embed/widget-code change (§9 embed-code independence, PRD-003 §9). Previously flagged as an ASSUMPTION at §20 item 15; no longer open. |
| Publish requires ≥1 supported input field (decision B5)                                                             | Applies together with multi-step's additional publish validation when active (§13.4) — both rules apply simultaneously, neither replaces the other.                                                                                                                                                                                                                                                                                           |
| Unpublish retains the Form record, no deletion                                                                      | Extended: unpublishing retains Form Capability Configuration and any Steps unchanged, consistent with V1's "retention, not deletion" principle (`FORMS-V2-DATA-REQUIREMENTS.md` §C.8) — a Form's existing Leads and their AI Qualification Results remain untouched historical records after unpublish.                                                                                                                                       |
| Historical Submissions/Leads are never rewritten by later Form edits                                                | Unchanged; applies identically to Step reassignment or Capability toggling after historical Submissions exist.                                                                                                                                                                                                                                                                                                                                |
| Whole-Form duplication / Form deletion                                                                              | Not a confirmed V1 feature at all (V1 only confirms field-level duplicate as an editor convenience) — **N/A**, not newly introduced by V2 either.                                                                                                                                                                                                                                                                                             |

---

## 17. Error and Fallback Behavior

| Condition                                                                                       | Visitor-facing                                               | Admin-facing                                                                                     | Lead created?                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| OTP active, entitlement not Active at submission time                                           | Normal submission without verification (safe fallback)       | Capability shows locked in editor, reason per state B/C/E                                        | Yes, per V1 rules                                                                                                  |
| OTP active and entitled, verification fails (implementation detail)                             | **OPEN** — OTP send/verify failure UX not defined here       | **OPEN**                                                                                         | **OPEN**, since Submission validity depends on this precondition when active — not resolved by any approved source |
| Multi-step active, entitlement not Active at submission/publish time                            | Presented/accepted as single-step base form                  | Capability shows locked; Publish rejected if multi-step-specific validation also fails (§13.4)   | Yes, per V1 rules, on the fallback single-step form                                                                |
| Multi-step active, publish validation fails (no Steps / unassigned Field)                       | N/A (Admin-side action)                                      | Publish rejected with reason                                                                     | N/A                                                                                                                |
| AI Qualification, Scenario A — entitlement failure                                              | Unaffected (system-side)                                     | Capability shows locked                                                                          | Yes — no qualification output                                                                                      |
| AI Qualification, Scenario B — AI runtime failure while entitled                                | Unaffected (system-side)                                     | Qualification result absent for that Lead; no Admin-facing error required by any approved source | **Yes — always.** Must never block.                                                                                |
| Entitlement check fails for any capability (State E)                                            | Falls back per that capability's rule above                  | "Temporarily unavailable" — distinct from State B/C                                              | Unaffected — fail-closed governs entitlement only, not Lead creation                                               |
| All V1 base error conditions (invalid form, spam/abuse, field validation, notification failure) | Unchanged from `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §16 | Unchanged                                                                                        | Unchanged from V1                                                                                                  |

---

## 18. Roles and Permissions

Reused from PRD-003 §13, not redefined:

| Role                | Sees capability panel                                         | Can activate an entitled capability                          | Sees locked capabilities | Acts on Billing/Plan directly  | New Forms-specific permission?                 |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------ | ------------------------------ | ---------------------------------------------- |
| Tenant Admin        | Yes                                                           | Yes                                                          | Yes                      | No — links out to Billing only | No — reuses existing V1 Form-editor permission |
| Business Staff      | **OPEN** — same inherited item as V1 §24 and PRD-002 §11.2 #4 | Same, pending resolution                                     | Same, pending resolution | No                             | No                                             |
| OPS                 | N/A — no OPS Forms surface (unchanged from V1)                | N/A                                                          | N/A                      | Yes, via Billing only          | No                                             |
| Public Visitor      | No                                                            | N/A                                                          | No                       | No                             | No                                             |
| Entitlement Service | N/A (system actor)                                            | Authoritative resolver, called by Forms V2, never overridden | N/A                      | N/A                            | N/A                                            |

**Data visibility for V2-specific data** — extends `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §21:

| Data                          | Public Visitor | Tenant Admin                    | Business Staff                                 | OPS  |
| ----------------------------- | -------------- | ------------------------------- | ---------------------------------------------- | ---- |
| Form Capability Configuration | No access      | Full read/write, own tenant     | Full read/write, own tenant (OPEN, same as V1) | None |
| Steps                         | No access      | Full read/write, own tenant     | Same OPEN item                                 | None |
| AI Qualification Result       | No access      | Read, own tenant (via the Lead) | Same OPEN item                                 | None |

---

## 19. Idempotency/Concurrency Requirements

Per instruction, only behaviors the approved documents actually require are stated as requirements; everything else is marked OPEN, consistent with how `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §17 already treats V1's own duplicate-submission question as an open technical/API design matter rather than inventing a rule.

**Actually required by approved sources:**

- **Mid-edit entitlement re-validation (PRD-002 §12.3, firm):** a Capability Configuration save must re-check entitlement at save-time, not rely on the state the editor loaded with. A stale-permission save must be rejected, not silently accepted and later overridden.
- **No data write on downgrade (§11):** the `enabled` flag is never rewritten by an entitlement change — only the live check's answer changes. This is a concurrency-relevant guarantee: a downgrade happening concurrently with any read of Capability Configuration must never produce a torn/inconsistent flag write.
- **Submission remains one atomic event even with Steps (§13.3):** multi-step must not fragment a single visitor submission into multiple concurrent or sequential Submission records.
- **Exactly one Lead per valid Submission, unconditionally, regardless of AI Qualification's outcome (§14.3):** AI Qualification running, failing, or being unavailable must never create zero or more than one Lead for a given valid Submission.

**Genuinely open, not resolved by any approved source:**

| #   | Question                                                                                              | Status                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Concurrent Admin/Staff edits to the same Form's Capability Configuration or Steps                     | OPEN — no conflict-resolution rule defined                                                                        |
| 2   | OTP send/verify session concurrency (resend, replay, rate limiting)                                   | OPEN — explicitly out of scope per `FORMS-V2-DATA-REQUIREMENTS.md` §C.2                                           |
| 3   | In-progress multi-step navigation state persistence between Steps before final submit                 | OPEN — not addressed by any approved source                                                                       |
| 4   | Re-running AI Qualification for a Lead that already has a Result (e.g., retried job)                  | OPEN — no idempotency rule defined for the qualification run itself                                               |
| 5   | Duplicate/accidental-retry Submission protection (double-click, timeout-retry)                        | OPEN — inherited unresolved from V1 (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §17); V2 does not newly resolve it |
| 6   | Authoring Steps or toggling capabilities while not currently entitled (vs. only enabling being gated) | OPEN — §13.2                                                                                                      |
| 7   | Behavior when a Phone-type field required by an active OTP configuration is deleted                   | OPEN — §12.1                                                                                                      |

---

## 20. Open API Decisions

Consolidated from §12–§19 above — nothing new introduced here beyond the collection:

| #   | Question                                                                                                                                                                                             | Source                                                                            | Classification                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | ~~OTP requiredness sub-setting~~ — **RESOLVED.** OTP has two independent per-Form flags, `otp_enabled` and `otp_required` (applicable only when `otp_enabled = true`). See §12.3.                    | PRD-003 §15 #1                                                                    | **CONFIRMED — no longer open**                                                                        |
| 2   | Behavior when a Form's only Phone-type field is deleted while OTP is enabled                                                                                                                         | Not addressed by any approved source                                              | Non-blocking, technical/API design                                                                    |
| 3   | Authoring Steps / toggling capabilities while not currently entitled                                                                                                                                 | Not addressed by any approved source                                              | Non-blocking, technical/API design                                                                    |
| 4   | In-progress multi-step navigation state persistence                                                                                                                                                  | Not addressed by any approved source                                              | Non-blocking, technical/API design                                                                    |
| 5   | Exact publish-rejection response shape when multiple multi-step validation rules fail at once                                                                                                        | Not addressed by any approved source                                              | Non-blocking, implementation detail                                                                   |
| 6   | AI Qualification re-run idempotency                                                                                                                                                                  | Not addressed by any approved source                                              | Non-blocking, technical/API design                                                                    |
| 7   | Exact Qualification Category value set                                                                                                                                                               | PRD-003 §15 #2                                                                    | Non-blocking, UX/business stage                                                                       |
| 8   | AI Qualification human override/correction                                                                                                                                                           | PRD-003 §15 #9                                                                    | Non-blocking, product-decision stage (not an API-behavioral question until resolved at product level) |
| 9   | Exact placement of Category/Explanation in the Lead UI                                                                                                                                               | PRD-003 §12, §15 #5/#8                                                            | Non-blocking, UX stage                                                                                |
| 10  | Concurrent Capability Configuration / Step edits by two sessions                                                                                                                                     | Not addressed by any approved source                                              | Non-blocking, technical/API design                                                                    |
| 11  | OTP send/verify implementation mechanics                                                                                                                                                             | Explicitly excluded from data requirements (`FORMS-V2-DATA-REQUIREMENTS.md` §C.2) | Out of scope for this planning layer entirely                                                         |
| 12  | Downgrade-notice delivery mechanism (banner/notification/email)                                                                                                                                      | PRD-002 §12.2                                                                     | Non-blocking, inherited from V1's Billing contract, UX stage                                          |
| 13  | Business Staff vs. Admin permission split                                                                                                                                                            | PRD-001 §24/§33 #6, PRD-002 §11.2 #4, PRD-003 §13                                 | Non-blocking, inherited unresolved from V1                                                            |
| 14  | Duplicate/retry Submission protection                                                                                                                                                                | Inherited from V1 §17                                                             | Non-blocking, technical/API design                                                                    |
| 15  | ~~Immediate-effect editing extended to Capability Configuration/Steps on a Published Form~~ — **RESOLVED.** Confirmed by you: takes effect immediately, no republish, no embed-code change. See §16. | Confirmed by explicit project decision (highest authority per the Authority Rule) | **CONFIRMED — no longer open**                                                                        |

Items 1 and 15 are now resolved and are retained in this table (struck through) for traceability rather than deleted, so the decision history stays visible. The remaining 13 items (2–14) do not block this document from being usable as a behavioral contract, consistent with how PRD-001/PRD-002/PRD-003 and the Data Requirements documents each carried forward non-blocking open items at their own approval.

---

## 21. API Behavior Matrix

| Behavior                               | Actor                       | Entitlement-gated?  | Enforcement points                                 | Fail state                                         | Blocks Lead creation? |
| -------------------------------------- | --------------------------- | ------------------- | -------------------------------------------------- | -------------------------------------------------- | --------------------- |
| Set capability enabled/disabled        | Admin/Staff                 | Yes (enabling only) | Admin config                                       | Rejected if not entitled; disabling always allowed | N/A                   |
| Read capability configuration          | Admin/Staff                 | N/A (read)          | Every render, live                                 | N/A                                                | N/A                   |
| OTP verification at submission         | Public Visitor              | Yes                 | Admin config, widget render, OTP-send call         | Falls back to unverified submission                | No                    |
| Multi-step navigation/submission       | Public Visitor              | Yes                 | Admin config, widget render, Publish               | Falls back to single-step                          | No                    |
| Multi-step publish validation          | Admin/Staff                 | Yes (multi_step)    | Publish                                            | Publish rejected                                   | N/A                   |
| AI Qualification run                   | System (post-Lead-creation) | Yes                 | Immediately after Lead creation                    | Scenario A: no output. Scenario B: no output.      | **Never**             |
| Plan/Capability visibility entry point | Admin/Staff                 | N/A (display only)  | Render time                                        | N/A (Billing-sourced, live)                        | N/A                   |
| Downgrade disable                      | System (Billing-triggered)  | N/A (system event)  | All enforcement points for the affected capability | Immediate disable, fallback applies                | No                    |
| Entitlement restoration                | System (Billing-triggered)  | N/A (system event)  | All enforcement points for the affected capability | Automatic re-enable, no data write                 | N/A                   |

---

## 22. Cross-Document Consistency Check

Checked against PRD-001, PRD-002, PRD-003, `FORMS-V1-DATA-REQUIREMENTS.md`, `FORMS-V2-DATA-REQUIREMENTS.md`, and `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md`.

- **Entitlement model:** This document's §7–§11 restate PRD-002 §10.1/§10.2/§11.1/§12.1–§12.3 and PRD-003 §11–§13 verbatim in behavior; no reinterpretation or new state was introduced. No conflict found.
- **Form → Submission → Lead model:** §13.3, §14.1, §14.3 preserve V1's unconditional one-Lead-per-valid-Submission rule and Steps' non-fragmenting effect on Submission. No conflict with `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §10.
- **AI Qualification vs. V1's "no scoring" exclusion:** §14.2 restates PRD-003's resolution (Category + Explanation is a business-readable classification, not a quantified score) without reopening `FORM_UX_SPECIFICATION_V1.md`'s scoring exclusion. No conflict.
- **OTP/Phone-field precondition:** §12.1 matches `FORMS-V2-DATA-REQUIREMENTS.md` §C.2 exactly; no divergence.
- **Multi-step publish validation:** §13.4 matches `FORMS-V2-DATA-REQUIREMENTS.md` §C.8/decision #6 exactly, and is stated as additive to, not a replacement for, V1's decision B5. No conflict.
- **No Forms-owned Billing data:** §15 restates PRD-002 §14/PRD-003 §10.4/`FORMS-V2-DATA-REQUIREMENTS.md` §C.6's hard exclusion without adding any new Forms-side data element. No conflict.
- **OTP requiredness (§12.3):** the two-flag model (`otp_enabled`, `otp_required`) was supplied by explicit project decision, which sits above PRD-003/Data Requirements in the Authority Rule. It does not contradict either document — both left this sub-setting open rather than specifying a conflicting model — and it introduces no Experience Type/Form Type enum, consistent with PRD-003's explicit exclusion of typed variants (§0, Out of Scope). No conflict.
- **Immediate-effect editing (§16):** previously flagged as an inference by analogy to V1 decision B1. Now confirmed by explicit project decision. No conflict with any approved source — V1 was silent on this specific extension, not contradictory to it.

**Overall: no contradictions found between this document and any approved source. The two previously open/assumed items (OTP requiredness, immediate-effect editing scope) are now resolved by explicit project decision and are reflected throughout §6, §12.3, §16, and §20.**

---

## 23. Open Questions

See §19 (idempotency/concurrency-specific) and §20 (consolidated, all categories) for the full lists. Summary count: **13 non-blocking open items remain** (§20 items 2–14; none blocking use of this document as a behavioral contract). **2 items are now resolved**: OTP requiredness (§20 item 1, §12.3) and immediate-effect editing scope (§20 item 15, §16) — both confirmed by explicit project decision.

---

## 24. Traceability to PRD / Data Requirements

| Section here                   | PRD-003      | FORMS-V2-DATA-REQUIREMENTS | PRD-002              | FORMS-V1-API-BEHAVIORAL-REQUIREMENTS              |
| ------------------------------ | ------------ | -------------------------- | -------------------- | ------------------------------------------------- |
| §2 Scope/Boundary              | §0, §6       | §A, §D                     | —                    | §1, §23                                           |
| §5–§6 Capability Configuration | §9, §11, §14 | §C.1                       | §10.2, §12.1         | §4 (pattern reused)                               |
| §7 Entitlement Checking        | §11, §14     | §C.5                       | §9, §10.1            | —                                                 |
| §8 Enforcement at Point of Use | §11          | §C.1                       | §10.1                | —                                                 |
| §9 Visible-but-Locked          | §11, §12     | —                          | §10.2, §12.1         | —                                                 |
| §10 Fail-Closed                | §11          | —                          | §10.1 State E, §15.1 | §20 (pattern)                                     |
| §11 Downgrade/Restoration      | §11, §12     | §C.7                       | §11.1, §12.2, §12.3  | —                                                 |
| §12 OTP                        | §10.1, §14   | §C.2                       | —                    | §8, §10 (extended)                                |
| §13 Multi-step                 | §10.2, §14   | §C.3, §C.8                 | —                    | §4.9 (extended)                                   |
| §14 AI Qualification           | §10.3, §14   | §C.4                       | —                    | §10 (extended), `FORM_UX_SPECIFICATION_V1.md` §12 |
| §15 Plan/Capability Visibility | §10.4        | §C.6                       | §14, §15             | —                                                 |
| §16 Lifecycle Compatibility    | §9           | §C.8                       | —                    | §4.9, §5, B1, B5                                  |
| §17 Error/Fallback             | §10.1–§10.3  | §C.7                       | §11.1                | §16                                               |
| §18 Roles/Permissions          | §13          | —                          | §11.2, §13           | §3, §21                                           |
| §19 Idempotency/Concurrency    | —            | —                          | §12.3                | §17                                               |

---

## APPROVAL STATUS

**Forms V2 — API Behavioral Requirements is APPROVED — IMPLEMENTATION READY, as of 2026-08-24.**

**What this approval covers:** the full behavioral contract in §1–§24 above, including every capability's request intent, preconditions, validation, authorization, entitlement check, state change, response behavior, error behavior, side effects, and idempotency/concurrency treatment, exactly as documented in this file.

**Decisions ratified by this approval, held exactly as confirmed (none reopened):**

1. OTP has two independent per-Form settings — `otp_enabled` and `otp_required` (§6, §12.3).
2. `otp_required` applies only when `otp_enabled = true`; it has no meaning otherwise (§12.3).
3. No Form Experience Type, Form Type, or tier enum is introduced anywhere — `{otp_enabled, otp_required}` combinations are descriptive shorthand only, never a stored or checked value (§6, §12.3).
4. Published Form edits to Capability Configuration and Steps take effect immediately — no republish step, no embed/widget-code change (§16).
5. Live entitlement enforcement at every point of use — Admin configuration, widget/hosted-page rendering, and public submission/publish time — never only at configuration time (§8).
6. Fail-closed behavior — a failed entitlement check is always treated as not-entitled, never fail-open, disabling only the affected capability (§10).
7. Downgrade/restoration — no data write on downgrade, safe fallback per capability applies immediately, and restoration is automatic with no tenant action once entitlement resumes (§11).
8. The V1 `Form → Submission → Lead` model is preserved and extended, never duplicated or forked (§2, §13.3, §14.1, §14.4).
9. AI Qualification output is exactly a Category + a short AI-generated Explanation, always after Lead creation, never gating it (§14.1, §14.2).
10. No numeric score, confidence percentage, confidence meter, confidence ranking, or equivalent quantitative mechanism exists anywhere in AI Qualification's output (§14.2).

**Approval basis:** every behavior in this document traces to PRD-001, PRD-002, PRD-003, `FORMS-V1-DATA-REQUIREMENTS.md`, `FORMS-V2-DATA-REQUIREMENTS.md`, or `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` (§24 Traceability), or to an explicit project decision that outranks those sources per the Authority Rule (the two OTP/immediate-effect-editing resolutions, §12.3 and §16). No behavior in this document was invented where a source was silent — such items remain marked OPEN (§20) rather than being resolved by this approval.

**Not reopened by this approval:** PRD-001, PRD-002, PRD-003, `FORMS-V1-DATA-REQUIREMENTS.md`, and `FORMS-V2-DATA-REQUIREMENTS.md` remain exactly as they stood before this approval. This approval is scoped to this document only.

**Remaining open items (§19, §20) are non-blocking** — carried forward as documented, not resolved by this approval, consistent with how PRD-001/PRD-002/PRD-003 and both Data Requirements documents each closed with non-blocking open items of their own.

**No implementation code, database schema, or SQL has been produced under this approval.** This document remains a behavioral contract for a future implementer (e.g., Claude Code) to build against — it does not itself constitute implementation.

## NEXT STEP

This document may now be handed to implementation planning (Claude Code handoff) when you're ready. No further planning-stage action is required on this document itself.
