# PRD-002 — Billing & Entitlements (Minimal V1)

**Repository location (for persistence):** `docs/prds/PRD-002-BILLING-ENTITLEMENTS-MINIMAL-V1.md` — matches the existing naming/location convention of `docs/prds/PRD-001-FORMS-LEAD-CAPTURE-V1.md`.

**Status:** **APPROVED — IMPLEMENTATION READY**
**Type:** Core Platform Capability (new)
**Exists because of:** Forms V2 requires paid-tier gating (OTP verification, multi-step forms, AI Lead Qualification, tier selection UI) — see planning conversation, [date of this session].
**Supersedes:** `PRODUCT_LANDSCAPE.md` line — _"Chat and Billing remain outside current confirmed scope until explicitly decided."_ Billing is now explicitly decided into scope, by explicit user decision (Authority Rule §1), scoped narrowly as below. Chat remains out of scope; this PRD does not touch it.
**Sequencing:** This PRD is a **blocking dependency** for Forms V2 (PRD-TBD). Forms V2 cannot define its tier-gating behavior until the entitlement-check contract here is confirmed.

---

## 0. Scope Discipline — Read Before Anything Else

This PRD exists to answer exactly one question: **"How does a capability (starting with Forms V2) know what a tenant is entitled to, and how does a tenant end up entitled to something?"**

It is deliberately **not** a redesign of the legacy Billing module (`routes/billing.cjs`: payment collection, invoice generation, subscription management, refund processing, payment analytics/reporting). Every legacy Billing capability not listed as in-scope below is excluded on purpose, not by oversight — see §7.

**Important conceptual boundary carried forward from `PRODUCT_LANDSCAPE.md` legacy evidence notes:** the legacy system conflated two different things under one "Billing" label:

1. **Tenant-SaaS billing** — Innovoot charges the _tenant business_ for platform access/tiers. **← This PRD is about this.**
2. **Customer payment collection** — the tenant's _end customer_ pays the tenant through Innovoot (e.g. legacy `hc_payments`, a patient paying a hospital for an appointment). **← Not this PRD. Untouched, unaffected, a separate future capability if ever needed.**

Every section below refers only to (1).

---

## 1. Business Problem

Innovoot currently has no concept of what a tenant is paying for, or any mechanism to differentiate what a tenant can access based on it. This has become a blocking problem specifically because of Forms V2: it needs to offer OTP verification, multi-step forms, and AI Lead Qualification as paid-tier capabilities, but today:

- There is no Plan/Tier concept anywhere in the approved platform data model.
- There is no record of what a tenant has paid for or when.
- There is no way to collect payment from a tenant for platform access.
- No capability in the system (Forms or otherwise) has any mechanism to ask "is this tenant entitled to X?" and get a governed answer.

Without this, Forms V2 cannot enforce tier-gating anywhere — not in Admin (a tenant could configure OTP without being entitled to it), not in the widget (a paid capability could render for a non-paying tenant), and not in the API (nothing would reject a disallowed request).

## 2. Objective

Establish the **minimum** billing and entitlement contract required for any platform capability to reliably gate behavior by what a tenant has paid for — proven first through Forms V2, but designed as a reusable Core Platform Capability (consistent with how Forms itself was scoped in PRD-001 §1) rather than a Forms-only mechanism.

Concretely, by the end of this PRD's implementation:

- A tenant can be assigned a Plan.
- A Plan maps to a defined set of Entitlements.
- A tenant's Plan can change (upgrade/downgrade). Per §6 resolution: the tenant requests a change and completes payment via an online gateway (provider TBD, §6.3); OPS holds the authority to assign the new Plan (§6.2). See §14–§15 for how this is modeled.
- Any capability can call a single, reliable entitlement check and get a correct yes/no.

**Explicitly not the objective:** replicate legacy Billing's full feature set (invoicing, refunds, tax handling, payment analytics/reporting, dunning workflows). If a future capability needs one of those, it gets evaluated and scoped then — not pre-built here on spec.

## 3. Target Users / Roles

| Role                                | Experience                      | Does                                                                                                                                                                                                                                                                                                |
| ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant Admin                        | Admin                           | Views current plan and what it includes; **requests** a plan change and completes payment where applicable; cannot directly assign a new Plan to themselves (§6.2 RESOLVED)                                                                                                                         |
| Tenant Staff                        | Admin                           | **OPEN** — whether Staff can view/change billing or this is Admin-only is a permission-model question inherited from the same unresolved Admin-vs-Staff distinction noted in Forms V1 (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §24 item 3). Not re-litigated here; flagged as a shared open item. |
| OPS                                 | OPS                             | Views a tenant's plan/entitlement state for support purposes, **and is the authorized actor for assigning/changing a tenant's Plan** (§6.2 RESOLVED).                                                                                                                                               |
| Platform capability (e.g. Forms V2) | System-to-system, not a UI user | Calls the entitlement check to decide whether to allow/render a gated behavior                                                                                                                                                                                                                      |
| End customer / visitor              | —                               | **Not involved.** This PRD has no consumer-facing surface. A visitor filling out a public form never sees billing/plan information.                                                                                                                                                                 |

## 4. Scope

### In Scope

| Area                                                              | What's required                                                                                                                                                                                                                                                                                                                                       | Why (traced to Forms V2 need)                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Plan / Tier definition**                                        | A named Plan, each mapping to a defined set of Entitlements (capability flags). Plans are platform-defined, not tenant-authored.                                                                                                                                                                                                                      | Forms V2 needs "Starter / Verified / Smart / Conversion Pro"-equivalent tiers to exist as real, checkable entities.                                                                                                      |
| **Subscription state**                                            | Per tenant: current Plan, active/inactive status, effective-since timestamp.                                                                                                                                                                                                                                                                          | A tenant's Forms V2 capabilities depend on knowing which Plan is currently active for them, right now.                                                                                                                   |
| **Payment collection**                                            | An online payment gateway integration sufficient to collect payment from a tenant as part of a plan-change request. **Specific provider not chosen (§6.3 RESOLVED as "online gateway, provider TBD")** — kept abstract at the product/API level so Razorpay, Stripe, or another supported gateway can be selected later without redesigning this PRD. | Without payment, "paid tier" has no way to actually become paid.                                                                                                                                                         |
| **Entitlement-check contract**                                    | A single, reliable way for any capability to ask "is tenant X entitled to capability Y?" and receive a governed, correct answer — including behavior when the check itself fails (must fail closed, not silently allow).                                                                                                                              | This is the actual integration point Forms V2 needs. Everything else in this PRD exists to make this answer trustworthy.                                                                                                 |
| **Minimum Admin capability**                                      | Tenant can see their current plan, what it includes, and a path to upgrade.                                                                                                                                                                                                                                                                           | A tenant needs to discover why a Forms V2 capability is locked and how to unlock it — this is the "Form-type/tier selection UI" from the legacy screenshots, redefined as a Billing surface rather than a Forms surface. |
| **Minimum OPS capability**                                        | OPS can view a tenant's plan and entitlement state (for support).                                                                                                                                                                                                                                                                                     | Baseline OPS visibility, consistent with OPS's confirmed responsibility for tenant account management (`PRODUCT_LANDSCAPE.md` §9 OPS IA).                                                                                |
| **Upgrade/downgrade handling — only as far as Forms V2 requires** | Defined behavior for what happens to a Forms V2 capability already in use (e.g. a published OTP-gated form) if the owning tenant downgrades below the required tier.                                                                                                                                                                                  | Prevents an undefined state where a form silently breaks or silently stays enabled past what's paid for.                                                                                                                 |

### Out of Scope (explicitly excluded — not oversight)

| Excluded                                                                                                    | Why                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Invoice generation / invoice history / PDF invoices                                                         | Legacy Billing feature; no Forms V2 dependency requires it                                                                                                               |
| Refund processing                                                                                           | No Forms V2 dependency requires it                                                                                                                                       |
| Tax handling (GST, etc.)                                                                                    | Legal/finance capability, not needed to prove the entitlement contract                                                                                                   |
| Payment analytics / reporting                                                                               | Legacy Billing feature; not a Forms V2 dependency                                                                                                                        |
| Customer/end-user payment collection (legacy `hc_payments`-equivalent, tenant's customer paying the tenant) | Different concept entirely — see §0 boundary. Untouched by this PRD.                                                                                                     |
| Specific gateway provider selection (Razorpay vs. Stripe vs. other)                                         | RESOLVED: online gateway confirmed as the mechanism (§6.3), but which provider is a later technical/procurement decision, not part of this PRD — kept abstract per §15.7 |
| Proration, credits, free trials                                                                             | No current Forms V2 need identified                                                                                                                                      |
| Dunning / failed-payment retry workflows                                                                    | Only "is the subscription currently active" matters for entitlement purposes; retry logic is a later refinement                                                          |
| Self-serve plan management portal beyond the minimum in §4 In Scope                                         | Full account/billing-management UX is a later, separately-scoped capability                                                                                              |
| Any general-purpose "Billing department" tooling (legacy: "Used by: Billing departments, finance teams")    | Innovoot has no Billing department as a target user for V1 — the target user is the tenant admin and OPS support, per §3                                                 |

### Assumptions (ASSUMPTION — stated explicitly, not confirmed)

- **ASSUMPTION:** Plans are flat and platform-wide (not per-vertical, not tenant-custom) for minimal V1 — consistent with Forms V2 needing a small, fixed set of tiers, not a configurable pricing engine.
- **ASSUMPTION:** One active Plan per tenant at a time (no add-on/à-la-carte entitlement purchases layered on top of a base plan) — the legacy model (one selected form-tier at a time) supports this being sufficient for V1.
- **ASSUMPTION:** Entitlements are boolean capability flags (can/cannot use OTP, can/cannot use multi-step, etc.) for V1 — not usage-metered (e.g. not "500 OTP sends/month"). Metering is a plausible future need but not evidenced as required yet.

## 5. Non-Goals (restated for clarity)

This document does not define: database schema, API endpoint design, payment gateway selection, authentication architecture, or Forms V2's own product behavior (that belongs in the Forms V2 PRD, which consumes this contract but is not defined here).

## 6. Open Business Decisions — **RESOLVED**

| #   | Decision                                                               | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Pricing** — what do Plans actually cost?                             | **RESOLVED as a modeling principle, not as fixed numbers:** pricing is platform-level business configuration, not an architectural or code-level value. Legacy ₹200/₹500/₹999 is **not** carried forward or assumed current. A Plan's price must be changeable by the business later without touching the Plan → Entitlements model, Forms V2, entitlement keys, or capability logic. Actual initial price values are a separate business-configuration exercise, not defined in this PRD. |
| 2   | **Plan-change ownership** — who can move a tenant to a different Plan? | **RESOLVED: OPS-owned.** OPS is the authorized actor for assigning/changing a tenant's Plan. Tenant Admin can view current/available Plans, see included/locked capabilities, and **request** a plan change — but cannot directly change their own Plan. Entitlements remain strictly derived from Plan + Subscription State regardless (§13 unaffected). OPS still cannot grant an individual entitlement override (§13 unaffected).                                                      |
| 3   | **Payment mechanism** — real gateway vs. interim manual process        | **RESOLVED: online payment gateway.** Specific provider (Razorpay, Stripe, or another supported gateway) is **not decided** and is deliberately kept abstract at the product/API level (§15.7) — this PRD does not get redesigned once a provider is chosen.                                                                                                                                                                                                                               |

**One design question surfaced by combining #2 and #3 — now RESOLVED:** OPS owns Plan _assignment_, and payment is collected via a _gateway_ as part of a tenant's request. **Confirmed: successful payment does not automatically assign the Plan.** OPS remains the authoritative actor and takes an explicit review/approve/assign action after payment succeeds. See §14.6 and §15.4 for the full lifecycle.

---

## 7. User Stories

Written using the terms fixed by §6's resolution: Tenant Admin **requests** a plan change; OPS **assigns** it. No story assumes self-serve final authority.

| #   | As a...                           | I want to...                                                                                                      | So that...                                                                                                                                               |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tenant Admin                      | see which capabilities my current plan includes                                                                   | I know what's available to me without guessing or trial-and-error                                                                                        |
| 2   | Tenant Admin                      | see _why_ a specific capability (e.g. OTP verification in Forms V2) is locked                                     | I understand it's a plan limitation, not a bug, and what would unlock it                                                                                 |
| 3   | Tenant Admin                      | request a plan change                                                                                             | I can move toward gaining an entitlement I don't currently have, even though I can't assign it myself                                                    |
| 4   | Tenant Admin                      | understand what happens to something I've already configured (e.g. a published OTP-gated form) if my plan changes | I'm not surprised by silently broken or silently-still-working behavior                                                                                  |
| 5   | OPS                               | view a tenant's current plan and entitlement state                                                                | I can support them without inspecting implementation details or guessing                                                                                 |
| 6   | Forms V2 (system, non-UI actor)   | ask "does tenant X currently have entitlement Y?" and get one governed answer                                     | I can decide whether to allow a specific behavior, consistently, everywhere that behavior can occur (Admin config, widget render, public API submission) |
| 7   | Platform (Innovoot, system-level) | have entitlement checks fail closed when the check itself errors                                                  | a system fault never accidentally grants free access to a paid capability                                                                                |
| 8   | Tenant Admin                      | be told clearly if my plan/subscription has lapsed, distinct from never having had a capability                   | I know whether I need to reactivate something versus upgrade to something new                                                                            |

**Deliberately not written:** any story about payment method entry, invoice viewing, refunds, or usage metering — none are in scope (§4).

---

## 8. User Journeys

### Journey A — Tenant discovers and pursues a locked capability

1. Tenant Admin is configuring a Form in Forms V2 and attempts to enable OTP verification.
2. The capability is visibly present but shown as locked, with a plain-language reason ("Not included in your current plan") — not silently hidden. _(UX RECOMMENDATION, not yet confirmed — see §10.2.)_
3. Tenant Admin follows a link to the Plan Overview screen, sees which plan(s) include OTP verification.
4. Tenant Admin **requests** a plan change and completes payment via the (abstracted) online gateway. This creates a Plan-Change Request (§14.6); it does **not** by itself change the tenant's active Plan.
5. Payment succeeds and is recorded as a Payment/Transaction. This does **not** itself change the tenant's Plan — OPS reviews/approves and assigns the new Plan as an explicit action (§14.6 RESOLVED: no automatic assignment on payment in Minimal V1).
6. Once OPS's assignment takes effect and Subscription State updates, the previously-locked control in Forms V2 becomes usable — no separate "sync" step, no re-login required.

### Journey B — Subscription lapses

1. A tenant's subscription becomes inactive (reason/mechanism not defined here — could be non-payment, cancellation, etc.).
2. Entitlements tied to that subscription stop resolving as active (see §10.1, State C).
3. Tenant Admin sees a distinct "lapsed/expired" indicator wherever they'd normally see their plan — different messaging from "never had this," since the tenant previously had access and lost it.
4. A path back to reactivation is presented. _(Mechanism undefined — same reasoning as Journey A step 4.)_

### Journey C — Downgrade while a gated capability is actively in use

1. A tenant has an active, published Form using a gated capability (e.g. multi-step).
2. The tenant's plan changes to one that no longer includes that entitlement.
3. Defined behavior is required for the already-published Form — see §10.1 State D for the options under consideration. **This journey cannot be finalized until §10.1 State D is decided** (flagged as a product/UX decision, not a commercial one — see §11).

### Journey D — OPS support and assignment

1. A tenant contacts support confused about why a capability is locked or behaving unexpectedly, or has completed a plan-change request and is waiting on assignment.
2. OPS opens the tenant's record and views current plan + entitlement state.
3. OPS assigns/changes the tenant's Plan (§6.2 RESOLVED: OPS-owned) — this is the same action whether triggered by a tenant's paid request or initiated independently by OPS (e.g. a manually-arranged plan change, comped access being _out of scope_ per §13's strict-derivation decision — no ad hoc entitlement grants, only real Plan assignment).
4. Subscription State updates; Entitlement Resolution reflects the new Plan immediately (§15.5).

### Journey E — System-level entitlement check (non-human actor, included because it's the journey that actually matters most for Forms V2)

1. Forms V2 (Admin config screen, widget render, or public submission-time API) needs to know if a specific behavior is allowed for a tenant.
2. It calls the entitlement check with the tenant and a specific entitlement key (e.g. `forms.otp_verification` — see §10).
3. The check returns one of the defined states (§10.1) — never a bare true/false, since "false" alone can't distinguish "never entitled" from "lapsed" from "check failed."
4. The calling capability renders/enforces accordingly, and — critically — **enforces the same answer at the point of actual public use, not only at Admin configuration time**, otherwise a downgrade after a form was configured would change nothing in practice.

---

## 9. Information Architecture / Screen Inventory

**IA change flagged:** `INFORMATION_ARCHITECTURE.md` currently lists Billing as "OUT OF CURRENT SCOPE — no nav." That line is now superseded per this PRD's existence (consistent with the `DECISIONS` already logged for this document) — a nav entry is required. Naming below is a working label, not a confirmed IA decision.

| Screen                                                                           | Experience                     | Purpose                                                                                                                                                        | Notes                                                                                                                                                                |
| -------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plan Overview**                                                                | Admin                          | Shows tenant's current plan, its included entitlements, and which Forms V2 (and future) capabilities are unlocked vs. locked                                   | Entry point referenced by every "locked capability" UI elsewhere in Admin                                                                                            |
| **Plan Comparison / Selection**                                                  | Admin                          | Lists available plans and the entitlements each includes                                                                                                       | Generalizes the legacy "Forms Comparison" table (screenshot 1) from Forms-specific to platform-wide, since entitlements can span more than Forms                     |
| **Plan Change / Request flow**                                                   | Admin                          | Tenant selects a target Plan, initiates a request, and completes payment via the (abstracted) online gateway                                                   | Represents a **request**, not a Plan change — the tenant's active Plan does not change until OPS assigns it (§6.2). No specific gateway UI is designed here (§15.7). |
| **Tenant Plan & Entitlement view**                                               | OPS                            | View a tenant's plan, subscription status, and resolved entitlements — **and assign/change the tenant's Plan** (§6.2 RESOLVED: OPS-owned, no longer read-only) | Primary OPS action surface for this PRD                                                                                                                              |
| **Locked-capability indicator** (not a standalone screen — an inline UI pattern) | Admin, inside Forms V2 screens | Shows a capability as visibly present but locked, with reason and a link to Plan Overview                                                                      | Reused everywhere a gated capability appears; see §10.2 for the open UX question on visible-vs-hidden                                                                |

**Explicitly not designed here:** invoice list/detail screens, payment method management, refund UI, usage/consumption dashboards — none are in scope (§4).

---

## 10. Entitlement Contract (Product-Level Behavioral Requirements)

This is the actual integration point Forms V2 (and any future capability) will consume. Per your refinement: **Forms V2 asks about a specific entitlement — e.g. `forms.otp_verification` — never a plan name, tier label, or price.** This is a firm product decision, not open: it keeps Forms V2 decoupled from however Plans are commercially structured, so a plan's composition can change without touching Forms V2's code.

**Proposed entitlement key shape** (illustrative, not a technical spec): namespaced by capability — `forms.otp_verification`, `forms.multi_step`, `forms.ai_lead_qualification`, `forms.tier_selection_ui`. Exact naming/format is a Data Requirements-stage decision; the _pattern_ (capability-scoped keys, not plan names) is what's confirmed here.

### 10.1 Required States

A boolean "entitled: yes/no" is insufficient — it can't distinguish _why_ the answer is no, and callers need to distinguish those reasons to behave correctly. Five states are required:

| State                                 | Meaning                                                                                                                           | Required behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A — Active**                        | Tenant's current plan includes this entitlement, and the subscription is active                                                   | Capability functions normally, everywhere it's enforced (Admin, widget, public API)                                                                                                                                                                                                                                                                                                                                                                                              |
| **B — Not available**                 | Tenant's plan has never included this entitlement                                                                                 | Capability is locked; UI communicates it's a plan limitation with a path to Plan Overview (see §9, §10.2 for visible-vs-hidden)                                                                                                                                                                                                                                                                                                                                                  |
| **C — Subscription inactive/expired** | Tenant's plan _would_ include this entitlement, but their subscription is not currently active                                    | Functionally equivalent to "not entitled" for enforcement purposes, but **must be messaged differently from State B** — "reactivate" language, not "upgrade" language, since the tenant previously had access                                                                                                                                                                                                                                                                    |
| **D — Downgrade while in active use** | Tenant had the entitlement, used it (e.g. published a capability-dependent Form), then moved to a plan that no longer includes it | **Open product decision — see §11.1.** Options identified below; not yet chosen                                                                                                                                                                                                                                                                                                                                                                                                  |
| **E — Check failed (system error)**   | The entitlement check itself could not resolve an answer (timeout, dependency failure, bad data)                                  | **Must fail closed** — treated as not-entitled for enforcement purposes. Never fail open, under any circumstance, since that would grant free access to a paid capability by accident. Distinguishable in the UI from State B/C so a paying tenant isn't told "not in your plan" when the real issue is a transient fault — recommend a distinct "temporarily unavailable" message. _(UX RECOMMENDATION; enforcement behavior — fail closed — is firm regardless of messaging.)_ |

**Enforcement principle (firm, not open):** the entitlement check must be enforced at the point of actual use — Admin configuration, widget rendering, _and_ public submission-time (e.g. an OTP-send call) — not only at Admin configuration time. Otherwise a downgrade after a capability was already configured would change nothing for real visitors.

### 10.2 Locked Capability Visibility — **CONFIRMED**

**Visible but locked.** A gated capability stays discoverable wherever it would normally appear in Admin — it is not hidden — but is clearly marked unavailable under the tenant's current plan, with a stated reason and a path to Plan Overview / the plan-change flow.

**Firm distinction (do not blur this):** visible-but-locked is a **display state only**. It has no bearing on enforcement. The capability must be genuinely unavailable through the real entitlement check at all three enforcement points confirmed in §10.1's enforcement principle — Admin configuration, widget/rendering, and public point-of-use/API. A locked-looking control that a client-side bug fails to actually block is a defect, not an acceptable edge case.

---

## 11. Decisions Requiring Resolution Before Data Requirements / API Finalization

### 11.1 State D — Downgrade While In Active Use — **CONFIRMED**

**Immediate disable, with a defined safe fallback.** Chosen over grandfathering (which would let paid usage continue after the entitlement is removed — contradicts §10.1's enforcement principle) and over freeze/read-only (which would keep serving paid functionality publicly, same contradiction).

**Governing product principle: a downgrade removes the paid capability, not the entire published Form.**

Sequence: Plan downgrade → entitlement becomes inactive → gated capability is disabled → the published Form remains available where possible, running on its base (ungated) behavior.

**Capability-specific fallback behavior (required — every gated capability must define one before it can be introduced as a paid entitlement):**

| Gated capability            | Fallback behavior on downgrade                                                                                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OTP verification            | OTP requirement is removed; the Form continues accepting submissions through normal (non-verified) validation                                                                                                                       |
| Multi-step forms            | Falls back to the base/single-step form experience — the same field set, presented as one step                                                                                                                                      |
| AI Lead Qualification       | AI qualification stops running; the Lead is still captured normally, just without the qualification step/output                                                                                                                     |
| Any future gated capability | Must have an explicit, defined safe fallback specified _before_ it is shipped as a paid entitlement — "disable with no fallback" is not an acceptable design for a capability that gates an otherwise-published, publicly-live Form |

**Required communication behavior:** because the fallback happens automatically and silently on the public surface, Admin must proactively surface the change to the tenant — not leave them to discover it by noticing a form behaves differently. At minimum: a visible notice in Admin identifying what was disabled, when, and on which Form(s), shown the next time the tenant is in Admin after the change takes effect. Exact mechanism (banner, notification center entry, email) is a UX-detail decision for the next design pass, not fixed here.

### 11.2 Commercial/business decisions — **RESOLVED, see §6**

- §6.1 Pricing — resolved as a configurability principle; no fixed values in this PRD.
- §6.2 Plan-change ownership — resolved: OPS-owned assignment, tenant requests only.
- §6.3 Payment mechanism — resolved: online gateway, provider TBD.

**These three no longer block** Data Requirements or API Behavioral Requirements — see §14–§15 below, built directly on these resolutions.

---

## 12. UX Behavior

Grounded directly in §10.1's five states and the two confirmations above.

### 12.1 The locked-capability pattern (applies everywhere a gated capability appears)

- **Presence:** the control/field/toggle for the capability is always rendered — never conditionally removed from the layout based on plan.
- **Locked appearance:** visually distinguished (e.g. disabled/dimmed interactive state), with a short, plain-language reason inline, not buried behind a hover or a separate help screen.
- **Reason copy must distinguish State B from State C** (§10.1): a capability never included in the plan reads as a plan limitation ("Not included in your plan") with an **upgrade-toward** path; a lapsed subscription reads as a lapsed-access message ("Your subscription is inactive") with a **reactivate** path. Same visual lock, different words, different implied next action.
- **State E (check failed):** must not render as State B/C. Shows a distinct, temporary-fault message ("Temporarily unavailable — try again") — the enforcement outcome is identical (fail closed, capability unusable), but the tenant should not be told they're missing something they actually pay for because of a transient fault.
- **Live, not cached:** every render of a gated control re-validates against the real entitlement check — a locked/unlocked state is never inferred from a locally cached plan label, since that would let a control appear briefly unlocked/locked incorrectly right after a plan change.
- **Path to resolution:** every locked instance links to Plan Overview (or the reactivation equivalent for State C) — never a dead-end lock with no next step.

### 12.2 Downgrade communication (required behavior, mechanism open)

- On the tenant's next Admin session following a plan change that disabled one or more capabilities, the tenant must see an explicit notice: what was disabled, on which Form(s), and when it took effect.
- This is a **required behavior**, not optional polish — it directly serves the governing principle (§11.1) that a downgrade should be understood by the tenant, not just silently absorbed by the fallback.
- Exact delivery mechanism (in-app banner vs. notification-center entry vs. email) is left to the next UX design pass — not fixed here.

### 12.3 Mid-edit entitlement loss (edge case, flagged for completeness)

If a tenant is actively editing a gated capability's configuration at the moment their entitlement changes underneath them (e.g. a downgrade takes effect mid-session), the save action must re-validate entitlement at save-time, not rely on the state the editor loaded with — consistent with §10.1's enforcement principle. A stale-permission save must be rejected, not silently succeed then get overridden.

## 13. Roles & Permissions

| Role                                  | Can view own/tenant plan & entitlements                                                                 | Can view locked-capability indicators | Can request a plan change | Can directly assign/change a tenant's Plan | Can directly edit entitlement mapping                                                        | Can view another tenant's plan |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------ |
| Tenant Admin                          | Yes                                                                                                     | Yes                                   | Yes                       | **No (§6.2 RESOLVED — OPS-owned)**         | No — entitlements are derived from Plan, never hand-edited by a tenant                       | No                             |
| Tenant Staff                          | **Open** — inherited from Forms V1's unresolved Admin-vs-Staff distinction (§11.2 #4); not decided here | Same as Admin, pending above          | **Open**, same dependency | No                                         | No                                                                                           | No                             |
| OPS                                   | Yes (any tenant, support purposes)                                                                      | Yes (any tenant)                      | N/A (not a requester)     | **Yes (§6.2 RESOLVED)**                    | **No — still no entitlement-override mechanism (§13 strict derivation, unaffected by §6.2)** | Yes                            |
| Platform/system (entitlement service) | N/A — not a human actor                                                                                 | N/A                                   | N/A                       | N/A                                        | Authoritative resolver: derives entitlement state from Plan + Subscription state per §10.1   | N/A                            |
| End customer / visitor                | No                                                                                                      | No                                    | No                        | No                                         | No                                                                                           | No                             |

**Resolved:** No entitlement-override mechanism exists in Minimal V1, not even as an internal/OPS shortcut. Entitlements are **strictly derived**, with no exception path:

> **Plan + Subscription State → Entitlement Service → Capability**

OPS may change _which Plan_ a tenant is on — if and only if the eventual §6.2 decision grants OPS that authority — but OPS cannot directly grant or remove an individual entitlement independent of Plan. There is no "flip this one capability on for this one tenant" control in this design.

**Future needs (trials, promotional access, compensation credits, grandfathering, temporary feature access) are explicitly not solved by an undocumented exception here.** If any of these become real requirements, they get scoped as their own dedicated platform capability (e.g. a "Promotional Entitlement" or "Trial Plan" concept that still flows through the same Plan → Entitlements model) — not bolted on as a manual override that bypasses it. This keeps the entitlement model auditable: at any point, a tenant's access is fully explained by their current Plan and Subscription State, nothing else.

---

## 14. Data Requirements (Conceptual — not a schema)

Follows the same conceptual-only convention as `FORMS-V1-DATA-REQUIREMENTS.md`: what information must exist, why, who owns/sees it. No tables, columns, keys, or types.

### 14.1 Data Principles

- **Plan ≠ Subscription State ≠ Entitlement Resolution ≠ Payment/Transaction ≠ Plan-Change Request** — five distinct conceptual entities, not one collapsed record (mirrors the Form≠Submission≠Lead separation in Forms V1).
- Pricing is configuration data attached to a Plan, never embedded logic — a Plan's price can change without altering entitlement keys, capability code, or the Plan's identity (§6.1 confirmed).
- Entitlements are derived, never stored as an independently editable fact about a tenant (§13 strict derivation, unaffected by any decision in this pass).
- Tenant data isolation applies throughout, consistent with `DATA_PRIVACY_PRINCIPLES.md` and the same principle in Forms V1.
- No legacy schema (`forms`, `hc_payments`, etc.) is assumed to carry forward — this is genuinely new data, per the project's Authority Rule.

### 14.2 Plan — Conceptual Entity

A platform-defined (never tenant-authored) named offering.

- **Needs:** a name/label; a defined set of Entitlement keys it grants; a price that is business-configurable data, not hardcoded; a status distinguishing offerable vs. retired plans.
- **Owned by:** the platform (Innovoot), not any tenant.
- **Visible to:** all tenants (for comparison/selection, §9), and OPS.
- **ASSUMPTION (flagged, not confirmed):** retiring a Plan does not itself change the Subscription State of tenants already on it — retiring only affects whether it's offerable to _new_ requests. What happens to existing subscribers of a retired Plan (migrate, grandfather, force a change) is not evidenced as a current need and is left for a future pass if it becomes one.

### 14.3 Entitlement — Conceptual Entity

A stable, capability-scoped key (e.g. `forms.otp_verification`) representing one gate-able capability.

- Defined by the platform; associated with one or more Plans (a Plan grants a set of Entitlements; an Entitlement could in principle belong to more than one Plan).
- Identity is decoupled from Plan naming and pricing — this is what makes §9's confirmed model (Forms V2 checks the key, never the Plan name) hold.
- **Not** tenant-editable, and **not** directly assignable to a tenant outside a Plan (§13).

### 14.4 Subscription State — Conceptual Entity

The per-tenant record of which Plan currently applies.

- **Needs:** current Plan reference; active/inactive status; effective-since timestamp; enough history to distinguish "never had this Plan" from "had it, lost it" — required to support the State B vs. State C distinction in §10.1 and Journey B in §8.
- **Written by:** the Plan-assignment action (§14.6, §15.4) — an OPS-authorized event, per §6.2.
- **Read by:** the Entitlement Resolution process (§14.7) and Admin/OPS UI.

### 14.5 Payment / Transaction Record — Conceptual Entity (deliberately minimal)

A record that a payment attempt occurred in connection with a Plan-Change Request.

- **Needs:** outcome (success/failure), amount, timestamp, and a reference linking it to the Plan-Change Request it was for.
- **Explicitly not modeled:** gateway-specific technical details (provider transaction IDs, signatures, webhook payloads) — these depend on a provider that hasn't been selected (§6.3) and belong to the eventual technical design, not this conceptual layer.
- **Explicitly minimal by design:** this is not an invoice and not a payment ledger — only enough to know "did this tenant pay, for what, when," sufficient for the plan-change flow and baseline OPS visibility. Full payment history/reporting remains out of scope (§4).

### 14.6 Plan-Change Request — Conceptual Entity

Represents a tenant's request to move to a different Plan — introduced specifically to model the confirmed split between "tenant requests" and "OPS assigns" (§6.2).

- **Needs:** requesting tenant, requested Plan, a status progression (e.g. requested → payment-pending → payment-confirmed → assigned, or a rejected/failed path), and a link to its Payment/Transaction record once payment occurs.
- **Written by:** the tenant (creates the request; §15.3), the payment step (updates it on payment outcome), and OPS (reviews/approves and advances it to assigned; §15.4).

**RESOLVED — confirmed lifecycle:**

> Tenant Admin requests Plan change → online payment is initiated → payment succeeds → payment transaction is recorded → **OPS reviews/approves and assigns the Plan** → Subscription becomes active for that Plan → Entitlement Service resolves the tenant's capabilities.

Payment success and Plan assignment are **two distinct events, not one**: a successful Payment/Transaction record does not, by itself, grant entitlements or change Subscription State. It only advances the Plan-Change Request to a payment-confirmed status, awaiting OPS's explicit assignment action. There is no payment-to-entitlement shortcut, and no automatic assignment in Minimal V1.

**Forward-compatibility note (architectural, not a Minimal V1 feature):** because Plan-Change Request, Payment/Transaction, and Plan assignment are modeled as three distinct events rather than collapsed into one, a future version could automate the OPS-assignment step (e.g. auto-assign on confirmed payment, still logged as performed under OPS's authority) without changing this data model. That automation is explicitly **not built now** — OPS performs this step manually in Minimal V1.

### 14.7 Entitlement Resolution (the actual contract Forms V2 consumes)

Not a stored entity — a computed answer, resolved at call-time from: the tenant's current Subscription State + the requested Entitlement key + the current Plan's entitlement set. Returns one of the five states defined in §10.1 (Active / Not available / Subscription inactive / Downgrade-disabled-with-fallback / Check failed).

---

## 15. API Behavioral Requirements — Behavioral Contracts Only

No endpoint design, no schema, no HTTP methods. Follows `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md`'s convention: product-level operation guarantees only.

### 15.1 Entitlement Check

- Given a tenant and an entitlement key, when any capability calls the check, then it receives exactly one of the five states defined in §10.1 — never a bare boolean.
- Given the check cannot resolve an answer (dependency failure, timeout, malformed data), when this occurs, then the result **must** be State E and **must** be treated as not-entitled by the calling capability for enforcement purposes — fail closed, no exception, per §10.1's firm enforcement principle.
- Given a valid Active result, when a capability consumes it, then it must re-check at the actual point of use (Admin, widget render, and public submission-time) — not rely on a result obtained only at configuration time.

### 15.2 Plan Listing / Comparison

- Given any authenticated tenant, when they request the list of available Plans, then they receive all currently-offerable (non-retired, §14.2) Plans, each with its included Entitlements and current price — never another tenant's data, never a retired Plan presented as selectable.

### 15.3 Plan-Change Request (tenant-initiated)

- Given an authenticated Tenant Admin, when they submit a request to move to a different Plan, then a Plan-Change Request is created in a requested state — this does **not** itself change the tenant's active Plan or Subscription State (§6.2).
- Given a Plan-Change Request requiring payment, when the tenant completes the payment step via the (abstracted) gateway, then a Payment/Transaction record is created reflecting the outcome, and the Plan-Change Request's status updates accordingly.
- Given a failed payment, when this occurs, then the tenant's current Plan and Subscription State remain unchanged, and the tenant is informed the request did not succeed — no partial or ambiguous state.
- Given a Tenant Admin attempts to directly set/change their own Plan without going through OPS-authorized assignment, when this is attempted, then it **must** be rejected — Tenant Admin has no direct Plan-assignment capability (§6.2, §13).

### 15.4 Plan Assignment (OPS-authorized)

- Given OPS, when they assign/change a tenant's Plan, then the tenant's Subscription State updates to reflect the new Plan.
- Given a Payment/Transaction record is created with a successful outcome, when this occurs, then it **must not**, by itself, change Subscription State or grant any entitlement — payment success and Plan assignment are distinct events (§14.6 RESOLVED). Payment success only advances the Plan-Change Request to a payment-confirmed status.
- Given a Plan assignment occurs — always following OPS's explicit review/approve/assign action in Minimal V1 (§14.6 RESOLVED: no automatic assignment on payment) — when this happens, then it **must** be attributable and auditable as an OPS-authorized action (§6.2, §13) — no anonymous or unattributed Plan changes.
- **Forward-compatibility (architectural, not built now):** the Plan-Change Request / Payment / Assignment split is designed so that a future version could automate the OPS-assignment step without changing this contract. Minimal V1 does not implement that automation — every assignment requires OPS's explicit action.

### 15.5 Downgrade / Entitlement Recalculation

- Given a tenant's Plan changes via OPS assignment, when this occurs, then Entitlement Resolution (§14.7) must immediately reflect the new Plan — no caching lag, no delayed propagation, consistent with §12.1's "live, not cached" requirement.
- Given a downgrade removes an Entitlement a tenant was actively using (State D, §10.1/§11.1), when this is detected, then the affected capability's confirmed fallback behavior (§11.1 table) must take effect, and the tenant must receive the confirmed downgrade-communication (§12.2) on next Admin access.

### 15.6 Isolation

- Given any operation — tenant-facing or OPS-facing — when it targets a tenant, Plan, or Entitlement outside the actor's authorized scope, then it fails and no cross-tenant data is exposed, consistent with the isolation principle carried from Forms V1.

### 15.7 Payment Gateway Abstraction (explicit, restated from §6.3)

This document defines the behavioral contract _around_ payment — initiation, success, failure, and their effect on Plan-Change Requests and Subscription State — but does not select or design against a specific gateway. Provider selection (Razorpay, Stripe, or another supported gateway) remains a later technical decision, and every behavioral requirement above must hold regardless of which provider is eventually chosen.

### 15.8 Non-Goals

This document does not define: database schema, SQL, endpoint URLs, HTTP methods, request/response JSON shapes, gateway SDK integration details, webhook design, authentication architecture, or ORM choice.

---

## DECISIONS

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Billing & Entitlements is now in scope as a Core Platform Capability, narrowly scoped to what Forms V2 needs — supersedes `PRODUCT_LANDSCAPE.md`'s prior "out of scope" status for Billing.                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2   | This PRD covers **tenant-SaaS billing only** (Innovoot ↔ tenant). Customer/end-user payment collection (tenant ↔ tenant's customer) is explicitly untouched.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 3   | Scope is capped at: Plans/tiers, Subscription state, Payment collection, Entitlement-check contract, minimum Admin/OPS capability, and upgrade/downgrade handling only where Forms V2 requires it.                                                                                                                                                                                                                                                                                                                                                                                                         |
| 4   | **Model confirmed: Plan → Entitlements → Capability.** Forms V2 (and any future capability) checks a specific entitlement key (e.g. `forms.otp_verification`), never a plan name or price.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 5   | Entitlement checks must fail closed on system error (State E) — firm requirement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 6   | Entitlement enforcement must occur at point of actual use (Admin, widget, and public submission-time), not only at configuration time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 7   | User Stories, User Journeys, and IA/Screens (§7–§9) are written in plan-change-mechanism-neutral language — none assume self-serve, OPS-assignment, specific pricing, or a specific gateway.                                                                                                                                                                                                                                                                                                                                                                                                               |
| 8   | **§10.2 CONFIRMED:** locked capabilities are visible-but-locked, never hidden. Visual lock is display-only and never substitutes for real enforcement at all three points (Admin, widget, public API).                                                                                                                                                                                                                                                                                                                                                                                                     |
| 9   | **§11.1 CONFIRMED:** downgrade behavior is immediate disable with a defined safe fallback per capability, not grandfathering and not freeze/read-only. Governing principle: _a downgrade removes the paid capability, not the entire published Form._                                                                                                                                                                                                                                                                                                                                                      |
| 10  | Fallbacks confirmed for the three named capabilities: OTP → normal submission without verification; Multi-step → single-step base form; AI Lead Qualification → normal lead capture without qualification. Any future gated capability requires an explicit fallback before shipping.                                                                                                                                                                                                                                                                                                                      |
| 11  | Downgrade-triggered capability changes must be proactively communicated to the tenant in Admin — not left for them to discover.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 12  | Entitlements are derived from Plan + Subscription state only, resolved by the entitlement service — no human directly hand-edits an individual tenant's entitlement.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 13  | **§13 open item #8 CONFIRMED:** strict derivation model — `Plan + Subscription State → Entitlement Service → Capability`. No entitlement-override mechanism exists in Minimal V1, including as an internal/OPS shortcut. OPS may change a tenant's Plan (subject to §6.2), never an individual entitlement directly. Trials/promotions/compensation/grandfathering, if they become real requirements, are future dedicated capabilities built on this same model — not exceptions to it.                                                                                                                   |
| 14  | **§6.1 RESOLVED:** pricing is business-configurable data on the Plan entity, decoupled from architecture/code. No specific price values are part of this PRD; legacy ₹200/₹500/₹999 is not assumed current.                                                                                                                                                                                                                                                                                                                                                                                                |
| 15  | **§6.2 RESOLVED:** OPS owns Plan assignment/change. Tenant Admin can view plans/entitlements and **request** a change, but cannot directly assign a new Plan to themselves. §13's roles table and §7–§9's stories/journeys/screens updated accordingly.                                                                                                                                                                                                                                                                                                                                                    |
| 16  | **§6.3 RESOLVED:** payment mechanism is an online payment gateway; specific provider not chosen and deliberately kept abstract at the product/API level (§15.7) so provider selection doesn't require redesigning this PRD.                                                                                                                                                                                                                                                                                                                                                                                |
| 17  | Data Requirements (§14) and API Behavioral Requirements (§15) added — Plan, Entitlement, Subscription State, Payment/Transaction, and Plan-Change Request modeled as five distinct conceptual entities; Entitlement Resolution modeled as a computed answer, not a stored entity.                                                                                                                                                                                                                                                                                                                          |
| 18  | **RESOLVED — payment/assignment lifecycle (§14.6, §15.4):** successful payment does **not** automatically assign the Plan in Minimal V1. Confirmed lifecycle: Tenant requests → payment initiated → payment succeeds → transaction recorded → **OPS reviews/approves and assigns the Plan** → Subscription becomes active → Entitlement Service resolves capabilities. Payment success and Plan assignment are modeled as two distinct events; no payment-to-entitlement shortcut exists. Architecture keeps this automatable in a future version, but Minimal V1 does not implement automatic assignment. |

## OPEN QUESTIONS

| #   | Question                                                                                      | Type                   | Status                                                                        |
| --- | --------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------- |
| 1   | ~~Pricing for each Plan~~                                                                     | Commercial             | **RESOLVED — §6.1.** Configurable business data, no fixed values in this PRD. |
| 2   | ~~Plan-change ownership~~                                                                     | Commercial             | **RESOLVED — §6.2.** OPS-owned assignment; tenant requests only.              |
| 3   | ~~Payment mechanism~~                                                                         | Commercial             | **RESOLVED — §6.3.** Online gateway; provider TBD, kept abstract.             |
| 4   | Admin-vs-Staff permission split for billing actions                                           | Commercial/permissions | Inherited open item from Forms V1; still not re-litigated here                |
| 5   | ~~OPS override authority over a tenant's Plan~~                                               | Commercial             | **RESOLVED — §6.2.** Yes, OPS is authorized.                                  |
| 6   | ~~State D downgrade behavior~~                                                                | Product/UX             | **RESOLVED — §11.1**                                                          |
| 7   | ~~Visible-but-locked vs. hidden~~                                                             | Product/UX             | **RESOLVED — §10.2**                                                          |
| 8   | ~~Can OPS grant an ad hoc entitlement override outside the Plan mapping?~~                    | Product/permissions    | **RESOLVED — §13. No override mechanism; strict derivation only.**            |
| 9   | Exact mechanism for downgrade-communication (§12.2): banner vs. notification-center vs. email | UX detail              | **Non-blocking follow-up** — deferred to next UX design pass                  |

**Note:** items #4 and #9 above are the only two remaining open items in this PRD. Both are explicitly non-blocking follow-ups — they do not gate implementation of this PRD and do not gate starting or progressing Forms V2 planning, which can reference this document's entitlement contract as-is.

## APPROVAL STATUS

**PRD-002 — Billing & Entitlements (Minimal V1) is APPROVED — IMPLEMENTATION READY.**

All product, UX, and commercial decisions required for implementation are resolved:

- Business problem, objective, target users, and scope confirmed (§1–§5)
- Three commercial decisions resolved: pricing model, plan-change ownership, payment mechanism (§6)
- Entitlement contract fully specified: five required states, fail-closed enforcement, visible-but-locked UX, immediate-disable-with-fallback downgrade behavior, strict no-override derivation (§10–§13)
- Payment/assignment lifecycle fully resolved: payment success and Plan assignment are distinct events; OPS performs assignment explicitly; no automatic assignment in Minimal V1 (§14.6, §15.4)
- Data Requirements and API Behavioral Requirements complete, conceptual-only, no schema/endpoint design (§14–§15)
- Two non-blocking follow-up items remain (Admin-vs-Staff permissions, downgrade-notification delivery mechanism) — both explicitly documented, neither gates implementation

This PRD now unblocks **Forms V2**: its entitlement contract (§10, §15.1) — checking keys like `forms.otp_verification`, `forms.multi_step`, `forms.ai_lead_qualification` — is what the Forms V2 PRD will consume directly.

---

_End of PRD-002. APPROVED — IMPLEMENTATION READY._
