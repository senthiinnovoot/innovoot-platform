# FORMS V2 — UX SPECIFICATION

**Status:** DRAFT — AWAITING YOUR REVIEW
**Type:** UX specification (conceptual/behavioral + layout intent). Not implementation code, not a component library, not a visual design file.
**Traces to (all unmodified, none reopened by this document):**

- `PRD-001-FORMS-LEAD-CAPTURE-V1.md` — APPROVED — IMPLEMENTATION READY
- `PRD-002-BILLING-ENTITLEMENTS-MINIMAL-V1.md` — APPROVED — IMPLEMENTATION READY
- `PRD-003-FORMS-ADVANCED-CAPABILITIES-V2.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V1-DATA-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V2-DATA-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` — APPROVED — IMPLEMENTATION READY
- `FORM_UX_SPECIFICATION_V1.md` — APPROVED — IMPLEMENTATION READY (the V1 UX spec this document extends; its confirmed screens, states, and patterns are inherited, not redefined)
- `PRODUCT_UX_PRINCIPLES.md`, `INFORMATION_ARCHITECTURE.md`, `PLANNING_BASELINE.md` — platform-level UX/IA/design-system context, evidence not requirements
- The five legacy Forms V2 screenshots — visual/product **evidence of intended direction only**, never authority for architecture, pricing, or entitlement logic (per PRD-003 §0)

---

## 0. Purpose and Governing Objective

This document defines the **UX** of Forms V2: screens, layout, components, states, actions, and navigation — built on top of the already-approved product (PRD-003), data (`FORMS-V2-DATA-REQUIREMENTS.md`), and API behavior (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md`) decisions. It introduces no new product, data, or API decisions; where those layers are silent, this document marks the UX question OPEN rather than inventing behavior.

**The governing objective, stated once and enforced throughout this document:**

```
V1 Form foundation  +  V2 capabilities  =  ONE Forms product
```

There is no second Forms product, no parallel "V2 Forms" module, and no Form Experience Type/Form Type entity anywhere in this document. A tenant creates and manages **Forms** — full stop. Some Forms have OTP on, some don't; some are multi-step, some aren't; some have AI qualification, some don't. "Starter," "Verified," "Smart," and "Conversion Pro" are **descriptive labels for common configurations of the same Form**, used in this document purely as UX/product language to help a tenant recognize familiar patterns — never as a stored value, a routing key, or a distinct screen set.

---

## 1. Forms List

**Purpose:** See all of a tenant's Forms, their state, and create new ones — unchanged from V1 in structure, extended only in what a row/detail can reveal.

**Entry point:** Forms nav item (existing V1 IA — Forms and Leads remain sibling top-level modules; PRD-003 §9 confirms **no new top-level Admin nav item** is added by V2).

**User/role:** Tenant Admin / Business Staff (Staff parity remains the same open item inherited from V1 — §18 below).

**Layout / hierarchy:** Unchanged from `FORM_UX_SPECIFICATION_V1.md` §6 — Title (primary), Status (Draft/Published/Unpublished) second, and the UX-recommended (non-blocking) Last Updated column. Create action remains primary/high-visibility.

**Components:** `data-display/StatusBadge` for status; `feedback/LoadingState`/`EmptyState`/`ErrorState` for list states, per V1.

**States:** Loading, Empty (first-run, distinguished from any filtered-empty state), Error-with-retry — all inherited unchanged from V1.

**Actions:** Create Form; open a Form (→ Form Editor); "View Leads" link per row (pre-filtered Leads List, unchanged from V1).

**Validation:** N/A (list screen).

**Locked/unavailable behavior:** None at this screen — capability entitlement is a per-Form, in-editor concern (§5 below), not a list-level gate. A Form with locked capabilities still lists normally.

**Empty/error states:** As V1 — "no forms created yet" vs. filtered-empty, per `PRODUCT_UX_PRINCIPLES.md` §14.

**Navigation:** → Create Form, → Form Editor (per row), → Leads List (filtered).

**Relationship to V1/V2:** **Unchanged screen.** V2 adds no new column, no capability indicator, and no filter to this screen — capability configuration is visible inside each Form's editor, not summarized here. (Whether a lightweight per-row capability indicator, e.g. small icons for OTP/multi-step/AI, would help scannability is **OPEN** — no approved source requires or forbids it; flagged non-blocking, §26.)

---

## 2. Single Form vs. Multiple Forms — Behavior Based on the Approved Model

**There is no "mode."** The legacy "Form Mode: Single/Multiple" toggle is explicitly excluded (`FORM_UX_SPECIFICATION_V1.md` "DO NOT CARRY FORWARD"; PRD-001's confirmed multi-form support). V1 already supports an unbounded number of Forms per tenant with no mode switch (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §4.1 — _"No limit on number of forms per tenant... multiple forms per tenant is explicitly supported"_). V2 does not reopen or reintroduce this concept.

**What this means for the UX:**

- The Forms List (§1) simply lists every Form the tenant has created — one, two, or a hundred — with no toggle, mode selector, or "upgrade to multiple forms" gate anywhere in the flow.
- **Each Form has its own independent Capability Configuration** (`FORMS-V2-DATA-REQUIREMENTS.md` §C.1 — the flags are scoped per-Form, not per-tenant). A tenant with three Forms can have one Starter-equivalent Form, one Verified-equivalent Form, and one Conversion-Pro-equivalent Form simultaneously — no product-level constraint prevents this, and no approved source describes a Form-count entitlement or limit of any kind.
- There is no cross-Form "which mode is this tenant in" state to display or manage. "Multiple Forms" is simply what happens when a tenant creates more than one Form — it needs no dedicated UX.

---

## 3. Form Creation

**Purpose:** Start a new Form — optionally using an **Experience preset** as a UX shortcut to pre-populate its capability configuration, per the screenshot-evidenced Starter/Verified/Smart/Conversion Pro presentation pattern.

**Entry point:** "Create" action on Forms List.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy — revised from the prior draft to incorporate the screenshot evidence:**

1. **Title input** (required) — unchanged from V1.
2. **Experience preset selector** — a set of four selectable options, presented as cards or a list (matching the screenshot's Starter/Verified/Smart/Conversion Pro presentation): **Starter, Verified, Smart, Conversion Pro / Multi-step**. Each option carries a short description of what it configures (see §4's mapping table). **Selecting one is optional** — a tenant who selects nothing, or explicitly picks Starter, gets the V1 baseline (all capabilities off).
3. Create → lands in Form Editor (Draft), with the Capability Configuration (§5) **pre-set according to the selected preset, and fully editable from that point on.**

**Components:** `Input`, `Button`, and a new **Experience preset selector** composite (cards or list, four options) — this is a new UX surface, flagged in §22 alongside the other reorderable-list implementation gaps, not yet mapped to an existing design-system composite.

**States:**

- No preset selected / Starter selected (default) → baseline configuration.
- A preset selected whose required entitlement is unavailable → that preset option renders **visible-but-locked** (§11's pattern, applied here for the first time at creation time), with the same "not included in your plan"/"reactivate" messaging and a link to Plan Overview (§10). **Selecting a locked preset does not silently create a Form with that capability half-configured** — the Form is created at the preset's structure (e.g., Multi-step's Step scaffolding) with the gated flag left off/inert until entitled, exactly as §16 already describes for a Form that loses entitlement after the fact. Exact wording and interaction for a locked-preset selection is **OPEN** (§26).

**Actions:** Select a preset (optional) → Create → lands in Form Editor with pre-set flags.

**Validation:** Title required. Preset selection is never required — a title alone is always sufficient to create a Form, preserving V1's original minimal-creation guarantee.

**Locked/unavailable behavior:** A preset requiring a not-entitled capability (Verified/Smart require `forms.otp_verification`; Conversion Pro requires `forms.multi_step`) is visible but locked, per §11. **Starter is never locked** — it requires no entitlement, being the V1 baseline.

**Empty/error states:** N/A beyond the locked-preset state above.

**Navigation:** → Form Editor.

**Relationship to V1/V2 — the boundary that must not be crossed:** The preset selector is **a UX shortcut/preset, not a Form Type selection.** Selecting "Verified" does exactly one thing: it sets `otp_enabled = true` and `otp_required = true` on the new Form's Capability Configuration, using the same write path as toggling those flags individually inside the editor (§7) — it creates no Form Type record, no enum value, and no separate code path. The instant the Form is created, the tenant is inside the **same single Form Editor** used for every other Form (§5), with those two flags already on and every other flag exactly as it would be for a hand-configured Form — nothing distinguishes a preset-created Form from a manually-configured one at the data or API layer (`FORMS-V2-DATA-REQUIREMENTS.md` §C.1; `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §5.1/§6). The tenant can immediately continue customizing — turn `otp_required` back off, add Multi-step, enable AI Qualification, or change fields — with no "locked-in" preset state at any point (§4 elaborates this further).

---

## 4. Form Experience Presentation — Starter / Verified / Smart / Conversion Pro

**These are descriptive UX/product experiences — presets over ONE Form system — never a Form Type entity, enum, or distinct backend concept.** This section defines how the screenshot-evidenced experience-selection pattern is preserved in the UX while resolving entirely to the same four capability flags documented throughout this specification. Nothing below introduces a new data or API concept beyond what `FORMS-V2-DATA-REQUIREMENTS.md` and `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` already define.

### 4.1 The four experiences, and what each preset resolves to

| Descriptive label               | Preset resolves to                                                                                                                   | What the tenant sees                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Starter**                     | `otp_enabled = false`, `multi_step_enabled = false` (AI Qualification independently on/off, since it has no legacy-tier counterpart) | The baseline V1 Form experience — single-view form, no verification step.                                                                                                                                                      |
| **Verified**                    | `otp_enabled = true`, `otp_required = true`                                                                                          | Visitor must verify their phone number via OTP before the Submission is accepted — no unverified path exists for this Form.                                                                                                    |
| **Smart**                       | `otp_enabled = true`, `otp_required = false`                                                                                         | Visitor is offered phone verification, but a Submission can still succeed without completing it.                                                                                                                               |
| **Conversion Pro / Multi-step** | `multi_step_enabled = true`, plus a starting Step scaffold; OTP and/or AI Qualification remain independently selectable on top of it | Fields are presented across sequential Steps instead of one view; can be combined with OTP and/or AI Qualification, since the three capabilities are independent (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §2 extension map). |

### 4.2 Selecting an experience is a preset action, not a state

Applying a preset — whether at Form creation (§3) or later, via a "Change experience" / "Apply preset" action inside the Form Editor (§5) — does exactly one thing: **it writes the corresponding capability flags using the same write path §7–§9 already define for toggling them individually.** There is no `experience_type` field being set alongside the flags; the preset is a **UI convenience that fills in a known-good combination of the real flags**, nothing more.

**Reapplying a preset to an already-customized Form (OPEN, §26):** if a tenant has hand-tuned a Form's flags and then selects a preset, whether this overwrites the current configuration outright, prompts for confirmation, or merges is not addressed by any approved source — flagged as a genuinely open UX interaction question, not resolved here.

### 4.3 The tenant can always customize further — no preset lock-in

Once a preset is applied (at creation or later), the resulting flags are **exactly as editable as if the tenant had set them by hand.** Selecting "Verified" does not commit the Form to being a Verified Form forever — the tenant can, in the same editing session or any later one:

- Turn `otp_required` back off (moving toward Smart-equivalent behavior),
- Turn `otp_enabled` off entirely (moving toward Starter-equivalent behavior),
- Add `multi_step_enabled = true` on top of an OTP preset (combining Verified/Smart with Conversion Pro's structure — a combination no single legacy screenshot showed, but one the underlying flags always permitted, since the three capabilities are independent),
- Add or remove AI Qualification independently of whatever preset was used to start.

No combination of flags is blocked by having started from a particular preset. The preset is a starting point, never a constraint.

### 4.4 Each Form is independently configurable; multiple Forms coexist freely

Per §2 (restated here because it's central to this section): **Capability Configuration is scoped per-Form**, not per-tenant. A tenant can create one Form via the Starter preset, a second via Verified, a third via Conversion Pro, and a fourth entirely hand-configured with no preset at all — all four exist simultaneously, each independently editable, with no shared "tenant experience mode" governing them. Presets never establish a tenant-wide default that other Forms inherit; each Form's preset choice (or absence of one) affects only that Form.

### 4.5 Changing configuration never changes the Form/embed relationship

Whether a Form's capability configuration was set via a preset at creation, changed later via a different preset, or hand-edited flag-by-flag, **the Form's identity and its embed/widget code never change as a result** (§14's hard rule, restated here for this specific case). A tenant who applies the Conversion Pro preset to a previously-Starter, already-published, already-embedded Form sees that change take effect on the exact same embed snippet, immediately, per §15 — no regenerated snippet, no new Form ID, no re-publish step.

### 4.6 How this is presented in the UI

The Form Editor's Capability Configuration panel (§5) may continue showing the same descriptive language as a computed, read-only summary line (e.g., "This Form is currently configured like a Verified Form") derived live from the current flag state — refreshed on every read, never stored, never sent to the API as a value, and never used to branch behavior. Whether this summary line is shown in addition to, or instead of, a persistent "Apply preset" action inside the editor (vs. only at creation) is **OPEN** (§26).

### 4.7 What does not exist

No Form Type entity, no `experience_type`/`form_type` enum or column, no locked feature bundle a tenant is stuck with once chosen, no fixed price-tier-to-experience mapping inside Forms, and no backend code path that behaves differently depending on which preset was used. Every experience described above is a **UI-layer convenience over the same four independent, freely combinable flags** documented in §5–§9 and in `FORMS-V2-DATA-REQUIREMENTS.md` §C.1 — nothing here changes that data model, and nothing here reopens PRD-003's explicit exclusion of typed Form-variant architecture (§0, §2 Out of Scope).

---

## 5. Form Editor

**Purpose:** Configure a Form's fields, CTA, Consent/Notice field (V1, unchanged), and — new in V2 — its Capability Configuration (OTP, Multi-step, AI Qualification).

**Entry point:** Forms List row, or directly after Create Form.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy:** Extends the V1 editor (`FORM_UX_SPECIFICATION_V1.md` §7) with one additional section: a **Capability Configuration panel**, positioned as a distinct section within the same editor — not a new screen, not a new nav item (PRD-003 §9: _"extension of the existing V1 Form editor, not a new screen"_). Recommended order (UX judgment, non-blocking): Fields → Capability Configuration → CTA/Consent → Preview/Publish, though exact ordering is **OPEN**.

**Components:**

- V1: `forms/FormField`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch` (required toggle), `forms/FormActions` (Save/Publish/Add Field).
- V2 additions: `Switch`/toggle controls for each capability flag (`otp_enabled`, `otp_required`, `multi_step_enabled`, `ai_qualification_enabled`), each rendered per the visible-but-locked pattern (§11) when not entitled.

**States:** Draft/Published/Unpublished (V1, unchanged) — see §15 for what changes and doesn't when editing a Published Form under V2.

**Actions:** All V1 actions (add/edit/reorder/delete field, configure CTA/Consent, Save, Publish, Unpublish) plus: toggle each capability on/off (§6–§9), open the OTP sub-panel, open the Multi-step Step builder, open the AI Qualification toggle panel.

**Validation:** V1 field-set and Publish validation (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §4.9, decision B5) applies unconditionally. When `multi_step_enabled = true`, the additional Publish validation in §8.4 applies on top of it, not instead of it.

**Locked/unavailable behavior:** Each capability toggle is **always rendered**, never conditionally removed based on plan (§11). Toggling a not-entitled capability is rejected with a reason distinguishing "not in your plan" from "reactivate your subscription" (§11).

**Empty/error states:** V1's field-list empty state ("no fields yet") is unchanged. A stale-permission save (entitlement lost mid-edit) is rejected with a clear message, per `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §5.1/PRD-002 §12.3 — the editor must re-check entitlement at save time, not trust what it loaded with.

**Navigation:** → Preview (§12), → Publish (§13), → Embed/Widget code (§14, unchanged location from V1), → Forms List.

**Relationship to V1/V2:** This is the single point where V1's Form concept and V2's three capabilities visibly come together as **one Form**, consistent with the governing objective in §0.

---

## 6. Field Builder

**Purpose:** Add, edit, order, and remove the Form's fields — **unchanged from V1**, since Multi-step (§8) is a presentation-layer grouping of the same Fields, not a new field-authoring surface (`FORMS-V2-DATA-REQUIREMENTS.md` §C.3: Steps reference existing Fields, they do not own or replace them).

**Entry point:** Within the Form Editor (§5).

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy, Components, States, Actions, Validation:** All inherited verbatim from `FORM_UX_SPECIFICATION_V1.md` §7 — six confirmed field types (Text, Textarea, Email, Phone, Select, Consent/Notice), required/optional toggle, drag-reorder, duplicate, delete. **No new field type is introduced by V2** — OTP verifies the existing Phone field type; it does not add a "Verified Phone" field type (`FORMS-V2-DATA-REQUIREMENTS.md` §C.2).

**Locked/unavailable behavior:** None — the Field Builder itself is never entitlement-gated; only the three V2 capabilities that _consume_ its output (OTP verifying a Phone field, Multi-step grouping fields into Steps) are gated.

**Empty/error states:** Unchanged from V1.

**Navigation:** Within Form Editor.

**Relationship to V1/V2:** **The one piece of V1 that both OTP and Multi-step directly depend on**, without being modified by either: OTP requires the Form to already contain a Phone-type field (§7.1); Multi-step requires every Field to be assigned to exactly one Step at publish time (§8.4). Neither capability changes what a Field _is_.

---

## 7. OTP Configuration

**Purpose:** Turn phone verification on for a Form, and decide whether it's mandatory or optional.

**Entry point:** Capability Configuration panel, within the Form Editor.

**User/role:** Tenant Admin / Business Staff.

### 7.1 Enable OTP (`otp_enabled`)

- **Layout:** A single toggle, labeled plainly (e.g., "Require phone verification"), inside the Capability Configuration panel.
- **Precondition, surfaced in the UI:** the Form must contain at least one Phone-type field. If it doesn't, the toggle is disabled (or attempting to enable it is rejected) with an explicit, plain-language message pointing back to the Field Builder — _"Add a Phone field to this Form before enabling OTP verification"_ — since the tenant must be told why, not left to guess (`FORMS-V2-DATA-REQUIREMENTS.md` §C.2, `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §12.1). Exact wording is a UX-copy detail, **OPEN**.
- **Entitlement:** gated on `forms.otp_verification` — visible-but-locked when not entitled (§11).
- **State change:** `otp_enabled` set only if both the Phone-field precondition and entitlement pass.

### 7.2 OTP Required (`otp_required`) — **CONFIRMED two-flag model**

- **Layout:** A second control, **visible and interactive only when `otp_enabled = true`** — e.g., a nested toggle or radio pair appearing directly beneath the primary OTP toggle once it's on, labeled to distinguish the two states plainly: _"Require verification to submit"_ (`otp_required = true`) vs. _"Offer verification, don't require it"_ (`otp_required = false`). Exact copy/control type (toggle vs. radio) is a UX-presentation detail, **OPEN** — the underlying two-boolean behavior is CONFIRMED, its exact widget is not.
- **When `otp_enabled = false`:** this control is hidden or disabled — `otp_required` has no meaning and is not evaluated (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §12.3).
- **No separate entitlement:** `otp_required` rides on the same `forms.otp_verification` key — there is no second lock state for this sub-setting; if OTP itself is locked, both controls are locked together.
- **Descriptive mapping (§4):** `otp_required = true` reads as "Verified Form" behavior; `otp_required = false` reads as "Smart Form" behavior — shown only as explanatory UX copy, per §4, never as a stored type.

**Public-facing consequence (informational, shown as a note in the editor, not a separate screen):** when `otp_required = true`, a visitor cannot submit without completing verification; when `otp_required = false`, verification is offered but a Submission can still succeed without it — the exact visitor-facing mechanics of the optional path (e.g., a "skip" affordance) are **OPEN**, non-blocking (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §12.3).

**Locked/unavailable behavior:** Both controls together show the visible-but-locked pattern (§11) when `forms.otp_verification` is not Active.

**Empty/error states:** Attempting to enable OTP with no Phone field present → inline rejection message (above). Entitlement lost mid-edit → save rejected, per §5.

**Relationship to V1/V2:** Adds exactly one new precondition to Submission validity (verified phone, when `otp_required = true`) on top of V1's existing per-field validation — never replacing it (`FORMS-V1-API-BEHAVIORAL-REQUIREMENTS.md` §8, extended by `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §12.2).

---

## 8. Multi-Step Editor

**Purpose:** Group the Form's existing Fields into an ordered sequence of Steps.

**Entry point:** Capability Configuration panel → Multi-step sub-panel, within the Form Editor. Legacy evidence: screenshot 5's Step 1–4 list with "+Add Step."

**User/role:** Tenant Admin / Business Staff.

### 8.1 Enable Multi-step (`multi_step_enabled`)

- A toggle in the Capability Configuration panel, gated on `forms.multi_step`, visible-but-locked when not entitled (§11).

### 8.2 Step Builder

- **Layout:** An ordered list of Steps (add/reorder/delete), each expandable to show which existing Fields are assigned to it, with per-Step field ordering. Steps **reference** existing Fields from the Field Builder (§6) — this sub-panel does not create new fields, it assigns and orders the Form's existing ones (`FORMS-V2-DATA-REQUIREMENTS.md` §C.3, firm boundary).
- **Components:** A reorderable list pattern (flagged in `FORM_UX_SPECIFICATION_V1.md` §19 as a UX/implementation gap even for the V1 Field list — the same gap applies here, not a new one introduced by V2).
- **Add Step:** explicit action, per legacy evidence.
- **Assign Fields to a Step:** a Field may belong to exactly one Step (enforced at publish, §8.4) — the UI should make it clear when a Field is unassigned or double-assigned, ahead of a Publish attempt, as error prevention (`PRODUCT_UX_PRINCIPLES.md` §5).
- **Delete a Step:** removes the Step and its Field associations only — **never deletes the underlying Fields** (`FORMS-V2-DATA-REQUIREMENTS.md` §C.8, firm boundary). The UI should make this non-destructive behavior legible (e.g., "Fields will return to Unassigned, not be deleted").
- **Step title/subtitle:** whether each Step carries its own heading distinct from the Form's is **OPEN** (`FORMS-V2-DATA-REQUIREMENTS.md` §E #1) — not decided by any approved source; this document does not assume it.

### 8.3 Public Multi-step Navigation (preview of §18's fuller treatment)

- Visitor sees one Step at a time, can move forward/back without losing entered data, and submits once on the final Step — **one Submission, never one per Step** (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §13.3).

### 8.4 Publish Validation

- **CONFIRMED product rule, surfaced as inline validation before/at Publish:** when `multi_step_enabled = true` — (1) at least one Step must exist; (2) every Field must belong to exactly one Step; (3) Step order must be deterministic; (4) Field order within each Step must be deterministic. A Publish attempt failing any of these is rejected with a reason identifying which rule failed (`FORMS-V2-DATA-REQUIREMENTS.md` §C.8; `FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §13.4). This applies **together with**, not instead of, V1's existing "≥1 supported input field" Publish rule.

**Locked/unavailable behavior:** Visible-but-locked (§11) when `forms.multi_step` is not entitled — Step builder becomes read-only/disabled, with the Form's existing Steps (if any were configured while previously entitled) preserved but inert (§16).

**Empty/error states:** "No Steps yet" empty state inside the sub-panel; Publish-blocked state with the specific validation failure named.

**Navigation:** Within Form Editor; feeds into Preview (§12) and Publish (§13).

**Relationship to V1/V2:** Fields remain V1's Fields, unmodified in identity or storage — Multi-step is purely a presentation/grouping layer on top of them (`FORMS-V2-DATA-REQUIREMENTS.md` §C.3, PRD-003 interpretation A).

---

## 9. AI Lead Qualification Configuration

**Purpose:** Turn on AI-generated Lead qualification for a Form.

**Entry point:** Capability Configuration panel → AI Qualification sub-panel, within the Form Editor.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy:** A single toggle — **"no manual AI-training/rules/configuration in this version"** (PRD-003 §9, confirmed). This is deliberately the simplest of the three capability sub-panels: on/off, nothing else to configure.

**Components:** `Switch`/toggle, plus the visible-but-locked pattern when not entitled.

**States:** On/off; locked/active/subscription-inactive/check-failed, same five-state model as the other two capabilities (§11).

**Actions:** Toggle on/off.

**Validation:** None beyond the standard entitlement/precondition checks (§5.1) — there is no Field-level precondition for AI Qualification, unlike OTP's Phone-field requirement.

**Locked/unavailable behavior:** Visible-but-locked (§11) when `forms.ai_lead_qualification` is not entitled.

**Empty/error states:** N/A at the configuration level — the interesting states for this capability live downstream, at the Lead (§19).

**Navigation:** Within Form Editor.

**Relationship to V1/V2:** This toggle governs whether qualification runs at all — it has no bearing on the Submission or Lead-creation flow itself, which is unconditional and unchanged (§19). Where the resulting Category + Explanation are surfaced in the Lead UI (Lead Detail vs. list vs. elsewhere) is **OPEN**, non-blocking (PRD-003 §12, §15 #5/#8) — this document does not invent a placement.

---

## 10. Plan / Capability Visibility and Billing Navigation

**Purpose:** Let a tenant see, from inside Forms, what Plan they're on and which of the three capabilities it includes — and link out to Billing to change it. **This is a display and navigation surface only.**

**Entry point:** A Forms-facing entry point — per PRD-003 §9, exact placement (reachable from the Forms List or from within a Form's editor) is **not fixed by any approved source**; this document does not invent a specific placement. Legacy evidence: screenshot 1 (Starter/Verified/Smart/Conversion Pro list, "Forms Comparison" table, pricing) — used as evidence that tenants need this visibility, **not** as authority for reproducing that table, its pricing, or its typed-tier list structure.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy:** Shows the tenant's current Plan (read from Billing, live, never cached), which of the three Form capabilities are included/unavailable under it, a locked-capability explanation where relevant (reusing §11's pattern), and a "View Plans / Change Plan" action.

**Components:** Read-only display composed from Billing-sourced data + Forms' own `enabled` flags at render time — **no new Forms-side data is created to support this** (`FORMS-V2-DATA-REQUIREMENTS.md` §C.6, confirmed as a no-new-data screen).

**States:** Live-rendered per capability (Active/Not available/Subscription inactive/Check failed) — same five-state vocabulary as §11, applied at account level here rather than per-Form.

**Actions:** "View Plans / Change Plan" → **exits into Billing's own screens** (Plan Overview, Plan Comparison, Plan Change/Request flow, PRD-002 §9). **Forms does not render Plan selection, pricing, comparison content, or a payment flow anywhere.**

**Validation:** N/A (read-only).

**Locked/unavailable behavior:** N/A at this screen — this screen's entire purpose is to explain locked/unlocked state elsewhere; it doesn't itself have a locked state (no entitlement key gates viewing this panel — `forms.tier_selection_ui` does not exist, PRD-003 decision #6).

**Empty/error states:** If the live Billing read fails, this panel should degrade to a clear "temporarily unavailable" state, consistent with the fail-closed messaging pattern used elsewhere (§11) — not silently show stale data.

**Navigation:** → Billing's Plan Overview/Comparison/Change flow (external to Forms, not designed here).

**Relationship to V1/V2:** **Hard boundary, repeated for emphasis:** Forms must never render Plan selection, pricing display, payment UI, or subscription management. This document does **not** design any Billing screen — only this Forms-facing entry point and its outbound link.

---

## 11. Locked Capability States

**Applies identically to all three capabilities (OTP, Multi-step, AI Qualification) everywhere they appear — the Capability Configuration panel (§5–§9) and the Plan/Capability visibility entry point (§10).** This is the one UX pattern reused across every gated surface in Forms V2, per `PRD-002` §10.2/§12.1 and PRD-003 §11's explicit reuse of it without a new visual pattern.

| State                              | Visual treatment                                                                                                   | Message                                                                                       | Action offered                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Active**                         | Normal, interactive toggle/control                                                                                 | —                                                                                             | Configure normally                    |
| **Not available** (never in plan)  | Visually locked (disabled/dimmed), always still rendered — never hidden                                            | "Not included in your plan" (upgrade-toward framing)                                          | Link to Plan Overview                 |
| **Subscription inactive** (lapsed) | Same visual lock as above                                                                                          | "Your subscription is inactive" (reactivate framing, distinct wording from Not-available)     | Link to reactivation flow             |
| **Check failed** (transient)       | Same visual lock, but distinct messaging                                                                           | "Temporarily unavailable — try again" — never worded like Not-available/Subscription-inactive | No plan action offered; suggest retry |
| **Downgrade-in-use → fallback**    | Toggle shows as locked even though the tenant's Form Capability Configuration flag remains `true` underneath (§16) | Same as Not-available/Subscription-inactive depending on cause                                | Link to Plan Overview / reactivation  |

**Firm rules, restated as UX requirements:**

- A capability's control is **always rendered**, never conditionally removed from the layout based on plan.
- The lock is a **display state only** — real enforcement happens server-side at every point of use (Admin config, widget render, public submission/publish time); a control that merely _looks_ locked without the backend actually blocking it is a defect, not an acceptable UX shortcut.
- Every render re-validates against a live entitlement check — never a cached Plan label. A tenant who upgrades mid-session should see the lock lift on next render, not require a full page reload assumption to be designed around (exact refresh mechanism is an implementation detail, not specified here).
- Every locked instance links somewhere actionable (§10) — never a dead end.

---

## 12. Preview

**Purpose:** See a representative public rendering of the Form before/while publishing — **inherited from V1**, extended to reflect active V2 capability states.

**Entry point:** Form Editor (existing V1 screen/action).

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy, Components:** Unchanged from V1 (`FORM_UX_SPECIFICATION_V1.md` §8) — desktop and mobile representative views, tenant branding applied.

**States:** Must reflect active capability states — OTP prompt appears when `otp_enabled = true`; Step navigation appears when `multi_step_enabled = true` — so a Tenant Admin previewing a Form sees what a visitor will actually experience (PRD-003 §12). **Exact preview behavior for a locked or fallen-back capability (show the fallback state? show nothing? show a note it's currently unavailable?) is OPEN** (PRD-003 §15 #5) — not decided by any approved source, not invented here.

**Actions:** N/A beyond viewing (V1 confirms no interactive validation simulation is required in Preview).

**Validation:** N/A.

**Locked/unavailable behavior:** See the OPEN item above.

**Empty/error states:** N/A.

**Navigation:** Back to Form Editor.

**Relationship to V1/V2:** One Preview surface for the one Form — no separate "V2 Preview" or per-capability preview mode.

---

## 13. Publish

**Purpose:** Make a Form publicly reachable — **inherited from V1**, with Multi-step's additional validation layered on top when active (§8.4).

**Entry point:** Form Editor.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy:** Unchanged from V1 — a Publish action; on success, both an embed artifact and a hosted-page artifact become valid.

**States:** Draft → Published (V1, unchanged). No new Form state is introduced by any V2 capability (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §16).

**Actions:** Publish.

**Validation:** V1's "≥1 supported input field, Consent/Notice alone insufficient" rule (decision B5), **plus** Multi-step's four-part validation from §8.4 when `multi_step_enabled = true`. Both apply together — neither replaces the other.

**Locked/unavailable behavior:** If `multi_step_enabled = true` but `forms.multi_step` is not Active at the moment of Publish, Publish either (a) proceeds with Multi-step's safe fallback (single-step presentation) or (b) is blocked pending the Step-validation rules being moot under the fallback — **the exact Publish-time UX when a capability's entitlement and its structural validation interact is not fully specified by any approved source beyond "entitlement check is a Publish-time enforcement point" (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §8, §13.4)** — flagged OPEN, non-blocking (§26).

**Empty/error states:** Publish-blocked state with the specific failing rule named (no fields / unassigned Field / no Steps / entitlement not Active).

**Navigation:** → Embed/Widget (§14).

**Relationship to V1/V2:** One Publish action for the one Form, regardless of which capabilities are active.

---

## 14. Embed / Widget

**Purpose:** Give the tenant a way to place the Form on their own site (embed) or share it directly (hosted page) — **fully unchanged by V2.**

**Entry point:** Form Editor, existing V1 screen/mechanism.

**User/role:** Tenant Admin / Business Staff.

**Layout / hierarchy:** Unchanged from V1 — embed snippet + hosted-page link, both derived from the same Form definition.

**Components:** Unchanged; `FORM_UX_SPECIFICATION_V1.md` §19 already flags embed-snippet-with-copy as a UX/implementation recommendation, not a new V2 concern.

**States, Actions, Validation:** Unchanged from V1.

**Locked/unavailable behavior:** N/A — the embed code itself is never entitlement-gated; what renders through it varies by the Form's live capability/entitlement state, resolved server-side.

**Empty/error states:** Unchanged from V1 (e.g., "This form is no longer available" for an unpublished Form reached via a live embed/link).

**Navigation:** N/A (terminal artifact of Publish).

**Relationship to V1/V2 — the confirmed, non-negotiable rule:** **No V2-specific change to the embed mechanism.** PRD-003 §9 states this directly: _"Capability state is data-driven per Form, resolved server-side via the entitlement check — never selected by the embed snippet."_ There is no `data-form=verified`-style parameter, no typed-variant routing, and no separate embed artifact per capability configuration. **The same embed code continues to work identically as the Form's configuration changes underneath it** — this is what makes §15 (immediate-effect editing) and §16 (downgrade/fallback) work without ever asking a tenant to regenerate or re-copy their embed snippet.

---

## 15. Published Form Editing

**Purpose:** Show what happens when a tenant edits a Form's Capability Configuration or Steps after it's already Published and live.

**Entry point:** Form Editor, on a Form already in Published state.

**User/role:** Tenant Admin / Business Staff.

**Behavior — CONFIRMED:** Per V1 decision B1 (editing a Published Form takes effect immediately, no republish step), extended and explicitly confirmed for V2's Capability Configuration and Steps: **edits take effect immediately on both the widget and the hosted page, with no republish step and no embed/widget-code change** (`FORMS-V2-API-BEHAVIORAL-REQUIREMENTS.md` §16, confirmed by explicit project decision). Historical Submissions and Leads are never rewritten by a later edit — they retain the configuration/field data as it existed at submission time (V1 rule, unchanged, extended in principle to capability state).

**States:** No new state — this is a behavior of the existing Published state, not a new one.

**Actions:** Any edit made in §5–§9 while Published takes effect live.

**Validation:** Same validation rules as Draft editing (§5, §8.4) — a save that would leave a Published Form in an invalid Multi-step configuration (e.g., an unassigned Field) should be prevented or clearly flagged before it goes live, consistent with error-prevention-over-recovery (`PRODUCT_UX_PRINCIPLES.md` §5). Exact mechanism (block the save vs. warn-and-confirm) is **OPEN** — `FORM_UX_SPECIFICATION_V1.md` §20 already flags the analogous V1 question (confirmation before a live field edit) as open; this document does not resolve it newly for V2.

**Locked/unavailable behavior:** If an entitlement is lost while a tenant is actively editing (mid-edit entitlement loss), the save must re-validate at save-time and reject a stale-permission save (§5, PRD-002 §12.3) — the editor should surface this clearly rather than silently succeeding and then being overridden.

**Empty/error states:** As above.

**Navigation:** Within Form Editor.

**Relationship to V1/V2:** This is the section that makes §0's "ONE Forms product" concrete for a live Form — a tenant toggling `otp_required` on a Published, actively-receiving-submissions Form sees the change apply to the very next visitor, on the exact same embed code.

---

## 16. Downgrade / Fallback States

**Purpose:** Show what a tenant sees, and what a visitor experiences, when a Plan downgrade removes entitlement for a capability that was configured and in use.

**Governing sequence (CONFIRMED, restated as UX):**

```
Form's stored configuration (enabled = true, e.g. otp_enabled/otp_required/multi_step_enabled/ai_qualification_enabled)
        remains preserved, unchanged, no data write occurs
                    +
Live entitlement check now returns "not entitled"
                    ↓
Capability becomes inactive at every point of use (Admin, widget, submission/publish)
                    ↓
Safe fallback applies:
  OTP        → normal submission without verification
  Multi-step → single-step base form
  AI Qual.   → normal lead capture without qualification output
                    ↓
The Form itself remains available — a downgrade never takes down the whole Form
```

**Admin-facing UX:**

- The Capability Configuration panel shows the affected toggle(s) as locked (§11's Not-available/Subscription-inactive pattern) — but critically, the toggle's underlying stored state is not reset; if the tenant re-enters the editor, they see the capability as still "configured on, now locked," not "turned off."
- **Downgrade notice (required behavior, delivery mechanism open):** on the tenant's next Admin session after a downgrade disables one or more capabilities, they must see an explicit notice — what was disabled, on which Form(s), and when it took effect (`PRD-002` §12.2). Exact mechanism (banner, notification-center entry, email) is **OPEN**, non-blocking, inherited unresolved from PRD-002.

**Visitor-facing UX:** No visible disruption beyond the capability's specific fallback — a visitor filling out a formerly-OTP-Verified Form simply submits without a verification step; a visitor on a formerly-multi-step Form sees a single-view Form instead. **The embed code is identical; nothing the tenant or visitor sees requires any embed/link change** (§14).

**AI Qualification specifically:** if entitlement is lost, Leads continue to be created normally; the Qualification Category/Explanation panel simply does not populate for new Leads during the downgraded period (§19).

**Empty/error states:** N/A beyond the notice above.

**Navigation:** Downgrade notice → Plan Overview (Billing).

**Relationship to V1/V2:** This is the clearest illustration of §0's principle in practice — the Form survives a downgrade intact; only the specific paid capability is affected.

---

## 17. Entitlement Restoration

**Purpose:** Show what happens when a tenant's Plan is upgraded/reactivated after a downgrade.

**Governing behavior (CONFIRMED, restated as UX):**

```
The moment the live entitlement check begins returning Active again
                    ↓
The capability resumes functioning under the SAME unchanged configuration
(the tenant's otp_enabled/otp_required/multi_step_enabled/ai_qualification_enabled
 flags were never touched during the downgrade — §16)
                    ↓
No tenant action required. No re-configuration. No re-publish. No new embed code.
```

**Admin-facing UX:** The Capability Configuration panel's previously-locked toggle simply becomes interactive/active again on next render — since every render performs a live check (§11), no manual "reactivate" click inside Forms is needed (that action, if any, happens in Billing, not Forms).

**Visitor-facing UX:** The capability's full behavior (OTP challenge, Step navigation, AI qualification) resumes exactly as it was configured, with no visible transition beyond "it works again."

**Empty/error states:** N/A.

**Relationship to V1/V2:** Symmetric with §16 — restoration is the mirror image of downgrade, and neither requires touching the Form's stored configuration, the embed code, or the widget.

---

## 18. Public Form Behavior

**Purpose:** Describe the end-to-end visitor experience across all V1+V2 combinations, on both the inline widget and the hosted page (functionally equivalent, per V1).

**User/role:** Public Visitor (unauthenticated).

**Baseline (V1, unchanged):** Fields render in configured order → inline validation on submit/blur → spam/abuse check (opaque) → server validation → Lead creation → success confirmation, or the same generic failure state for any failure category (validation, spam/abuse, or unconfirmed Lead creation — never a differentiated message that could reveal cause).

**With OTP active (`otp_enabled = true`):**

- `otp_required = true`: visitor must complete phone verification before the Submission can succeed — a verified phone number becomes a hard precondition to Submission validity, layered on top of V1's validation, not replacing it.
- `otp_required = false`: verification is offered; a Submission can still succeed without it. The exact interaction for skipping/declining is **OPEN** (§7.2).
- Fallback: if entitlement is lost at submission time, OTP silently falls back to normal (unverified) submission — the visitor is never blocked by a billing-side problem they have no way to resolve.

**With Multi-step active (`multi_step_enabled = true`):** Visitor progresses through Steps, can move forward/back without losing entered data, submits once on the final Step — one Submission, identical in structure to a single-step Form's Submission. Fallback: single-step presentation of the same fields if entitlement is lost.

**With AI Qualification active:** No visitor-facing difference at all — qualification runs entirely after Submission/Lead creation, with no additional visitor-facing questions (§19). This is the one capability with zero public-UX footprint.

**Unpublished Form reached via a live link/embed:** "This form is no longer available" — unchanged from V1, applies regardless of which V2 capabilities were configured.

**Responsive behavior:** Mobile-first by default (§24), unchanged and extended to OTP/Step UI — no exact breakpoints defined here.

**Relationship to V1/V2:** The public experience remains **one Form-submission flow**, with OTP and Multi-step as additive steps within it — never a fork into a "V2 flow" separate from V1's.

---

## 19. Submission → Lead → AI Qualification Flow

**Purpose:** Show the complete, ordered flow from a visitor's Submission through to a Lead's AI Qualification result — the one place V2 most directly extends V1's core behavioral guarantee.

**Sequence (firm, CONFIRMED, not reinterpreted):**

```
Visitor submits (validation + spam/abuse + OTP precondition if active, all pass)
                    ↓
Submission stored (V1, immutable, unchanged)
                    ↓
Lead created — UNCONDITIONALLY, exactly one Lead per valid Submission (V1 rule, unchanged)
                    ↓
[If ai_qualification_enabled = true AND forms.ai_lead_qualification is Active]
AI Qualification runs against the created Lead/Form data
                    ↓
Category + Explanation attached to the Lead
```

**What this guarantees, stated as UX requirements:**

- **Lead creation never waits for, and is never gated by, AI Qualification.** The visitor's success confirmation is driven entirely by Lead creation (V1's existing rule) — AI Qualification runs strictly afterward and has no bearing on what the visitor sees.
- **If AI Qualification fails** — whether because the capability isn't entitled, or because the AI service itself errors/times out while entitled — **the Lead still exists, exactly as it would without AI Qualification at all.** The two failure scenarios are functionally identical from the Lead's perspective: the Lead is there, and the Category/Explanation are simply absent for that Lead.
- **Output, exactly:** a Qualification Category (business-readable classification; exact value set is **OPEN**, §26) plus a short AI-generated Explanation. **No numeric score, confidence percentage, confidence meter, or confidence ranking of any kind, under any framing** — this is a hard constraint carried through from PRD-003 and both Data Requirements documents, not a UX styling choice.
- **Labeling requirement:** wherever the Category/Explanation are shown to a Tenant Admin, they must be clearly identified as AI-generated and shown together (Explanation never hidden behind an extra click) — never presented as an unquestionable business fact.
- **Existence/absence only:** a Lead has 0 or 1 Qualification Results — there is no "pending/never ran/failed" state model to display; if it's not there, it simply isn't there for that Lead (`FORMS-V2-DATA-REQUIREMENTS.md` decision #4).

**Where this is surfaced:** Lead Detail vs. Leads List vs. elsewhere is **OPEN**, non-blocking (§26) — this document does not invent a placement, consistent with PRD-003 leaving this as a UX-stage decision.

**Human override/correction of the Category:** **OPEN** (§26) — not addressed by any approved decision; this document does not design an override control.

**Relationship to V1/V2:** This flow is the clearest structural proof of "ONE Forms product" — Submission and Lead are exactly V1's concepts, untouched; AI Qualification is a pure enrichment appended after the fact, never a fork of the Submission→Lead pipeline.

---

## 20. Screen Inventory

| Screen/Panel                           | Surface | User               | New in V2?     | Notes                                                         |
| -------------------------------------- | ------- | ------------------ | -------------- | ------------------------------------------------------------- |
| Forms List                             | Admin   | Tenant Admin/Staff | No (unchanged) | §1                                                            |
| Create Form                            | Admin   | Tenant Admin/Staff | Extended       | §3 — same screen, adds optional Experience preset selector    |
| Form Editor                            | Admin   | Tenant Admin/Staff | Extended       | §5 — same screen, new Capability Configuration section        |
| Field Builder                          | Admin   | Tenant Admin/Staff | No (unchanged) | §6                                                            |
| Capability Configuration panel         | Admin   | Tenant Admin/Staff | **New**        | §5, within Form Editor — not a new top-level screen           |
| OTP configuration sub-panel            | Admin   | Tenant Admin/Staff | **New**        | §7                                                            |
| Multi-step Step builder sub-panel      | Admin   | Tenant Admin/Staff | **New**        | §8                                                            |
| AI Qualification toggle                | Admin   | Tenant Admin/Staff | **New**        | §9                                                            |
| Plan/Capability visibility entry point | Admin   | Tenant Admin/Staff | **New**        | §10 — display/nav only, links to Billing                      |
| Form Preview                           | Admin   | Tenant Admin/Staff | Extended       | §12 — reflects active capability states                       |
| Publish action                         | Admin   | Tenant Admin/Staff | Extended       | §13 — additional Multi-step validation                        |
| Embed/Widget code                      | Admin   | Tenant Admin/Staff | No (unchanged) | §14                                                           |
| Leads List                             | Admin   | Tenant Admin/Staff | Unchanged (V1) | Not re-specified here — see V1                                |
| Lead Detail                            | Admin   | Tenant Admin/Staff | Extended       | Category/Explanation surfaced somewhere — placement OPEN, §19 |
| Public Form (widget/hosted)            | Public  | Visitor            | Extended       | §18 — adds OTP challenge and/or Step navigation when active   |
| Submission Success/Failure             | Public  | Visitor            | Unchanged      | Inherited from V1                                             |
| Unpublished Form                       | Public  | Visitor            | Unchanged      | Inherited from V1                                             |

No screens beyond this set are introduced. In particular: **no Form Experience Type selector, no per-type dashboard, and no Billing screen** are introduced anywhere in this inventory.

---

## 21. User Journeys

### Journey A — Tenant creates a "Verified"-equivalent Form

1. Tenant Admin creates a new Form (§3), selects the **Verified** Experience preset — the new Form lands in Draft with `otp_enabled = true`, `otp_required = true` already set (§4.1).
2. Adds fields via Field Builder, including a Phone field (§6) — required for the OTP precondition to hold once verified.
3. Opens Capability Configuration and confirms the preset-applied flags, adjusting anything further as desired (§4.3) — no lock-in from having used a preset.
4. Previews the Form — sees the OTP challenge appear (§12).
5. Publishes (§13) — embed/hosted artifacts become valid (§14).
6. A visitor cannot submit without verifying their phone (§18).

### Journey B — Same tenant creates a "Smart"-equivalent Form

1. Repeats steps 1–2 above on a second, independent Form.
2. Enables OTP, sets `otp_required = false` (§7.2).
3. A visitor on this second Form can submit with or without completing verification (§18) — the tenant's first Form (Journey A) is entirely unaffected, since Capability Configuration is per-Form (§2).

### Journey C — Tenant encounters a locked capability

1. Tenant Admin attempts to enable Multi-step on a Form; not entitled.
2. Toggle renders locked, with "Not included in your plan" and a link to Plan Overview (§11).
3. Tenant follows the link into Billing (§10), requests a Plan change (Billing-owned flow, not designed here).

### Journey D — Downgrade while a capability is live

1. A previously-Verified Form (Journey A) is actively receiving Submissions.
2. Tenant's Plan is downgraded; `forms.otp_verification` becomes not-entitled.
3. Without any tenant action, the next visitor to the same embed code submits without a verification step (§16).
4. On their next Admin session, the tenant sees a notice that OTP was disabled on this Form (§16).
5. Tenant later reactivates/upgrades; OTP resumes with `otp_required` still `true`, exactly as configured — no re-setup (§17).

### Journey E — Submission through to AI Qualification

1. Visitor submits a Form with AI Qualification entitled and enabled.
2. Lead is created immediately (§19) — visitor sees success regardless of what happens next.
3. AI Qualification runs; Category + Explanation attach to the Lead.
4. Tenant Admin later views the Lead and sees the Category/Explanation, clearly labeled AI-generated (exact placement OPEN).
5. **Alternate path:** the AI service times out. Lead still exists from step 2; no Category/Explanation ever appears for it — no error is required to be shown to the tenant beyond the qualification simply being absent (§19).

---

## 22. Component / Behavior Matrix

| Component/Pattern                                            | Used by                                                                                                                            | Existing (V1) or New                            | Notes                                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `data-display/StatusBadge`                                   | Forms List, Form status                                                                                                            | Existing                                        | Unchanged                                                                                                       |
| `feedback/LoadingState`/`EmptyState`/`ErrorState`            | Forms List, Leads List, all panels                                                                                                 | Existing                                        | Unchanged; V2 panels reuse the same vocabulary                                                                  |
| `forms/FormField`, `Input`, `Textarea`, `Select`, `Checkbox` | Field Builder                                                                                                                      | Existing                                        | Unchanged                                                                                                       |
| `Switch`                                                     | Field required-toggle, all V2 capability toggles (`otp_enabled`, `otp_required`, `multi_step_enabled`, `ai_qualification_enabled`) | Existing, reused                                | No new toggle primitive needed                                                                                  |
| Visible-but-locked pattern                                   | Every gated capability control, Plan/Capability entry point                                                                        | **New pattern, one instance reused everywhere** | §11 — not a new component per se, a state treatment applied consistently                                        |
| Reorderable list (fields)                                    | Field Builder                                                                                                                      | Existing gap, flagged since V1                  | `FORM_UX_SPECIFICATION_V1.md` §19 — unresolved implementation dependency, not new to V2                         |
| Reorderable list (Steps + field assignment)                  | Multi-step Step builder                                                                                                            | **New surface, same underlying gap as above**   | May share a component with the Field-list reorder pattern — implementation-time judgment call, not decided here |
| Downgrade notice                                             | Admin, next session after downgrade                                                                                                | **New**                                         | Delivery mechanism OPEN (banner/notification/email)                                                             |
| Category/Explanation display                                 | Lead Detail (or elsewhere, OPEN)                                                                                                   | **New**                                         | Must be clearly AI-labeled; placement not fixed here                                                            |
| `feedback/Toast`                                             | Admin save/publish confirmations                                                                                                   | Existing                                        | Unchanged; not currently mounted app-wide per `PLANNING_BASELINE.md` — implementation dependency, not a UX gap  |

---

## 23. V1 → V2 UX Mapping

| V1 element                            | V2 treatment                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Forms List                            | Unchanged (§1)                                                                                       |
| Create Form                           | Unchanged (§3)                                                                                       |
| Form Editor                           | Extended with Capability Configuration section (§5)                                                  |
| Field Builder                         | Unchanged (§6)                                                                                       |
| Form Preview                          | Extended to reflect capability states (§12)                                                          |
| Publish                               | Extended with Multi-step validation when active (§13)                                                |
| Embed/Widget                          | Unchanged, and explicitly confirmed to remain unchanged as configuration changes (§14)               |
| Draft/Published/Unpublished lifecycle | Unchanged; no new state (§13)                                                                        |
| Editing a Published Form (B1)         | Extended: now explicitly covers Capability Configuration and Steps, confirmed immediate-effect (§15) |
| Submission → Lead (unconditional)     | Unchanged, now followed optionally by AI Qualification (§19)                                         |
| Leads List / Lead Detail              | Unchanged list; Lead Detail extended with optional Category/Explanation (§19, placement OPEN)        |
| Generic spam/abuse opacity            | Unchanged — applies identically regardless of which V2 capabilities are active                       |
| Tenant branding                       | Unchanged — one logo + one primary color, uniformly applied, including to OTP/Step UI                |

---

## 24. Responsive / Mobile Considerations

Inherited from `PRODUCT_UX_PRINCIPLES.md` §7/§12 and `FORM_UX_SPECIFICATION_V1.md` §15, extended to V2 surfaces:

| Surface                     | Principle                               | Status                                                                                                                                                    |
| --------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin desktop               | Primary target                          | RECOMMENDATION (unchanged from V1)                                                                                                                        |
| Admin tablet                | Secondary target                        | RECOMMENDATION                                                                                                                                            |
| Admin mobile                | No confirmed support level              | **OPEN** — platform-wide gap, not resolved here or by V1                                                                                                  |
| Public widget/hosted mobile | Primary, mobile-first by default        | **CONFIRMED** — extends directly to OTP challenge UI and Step navigation, which must both work cleanly on mobile as the primary case, not an afterthought |
| Public desktop              | Fully supported, not the primary target | CONFIRMED (equivalence requirement, unchanged from V1)                                                                                                    |

**V2-specific responsive notes:**

- The Capability Configuration panel, OTP sub-panel, and Multi-step Step builder are Admin surfaces — they inherit Admin's desktop/tablet-primary posture, with mobile Admin support remaining an open platform-wide question, not a V2-specific one.
- Step navigation on the public surface must reprioritize, not shrink — a multi-step Form on mobile should present one Step per screen naturally, consistent with mobile-first design rather than a scaled-down desktop multi-column layout.
- No exact breakpoints are defined here — that remains a design-system/technical decision, per `PLANNING_BASELINE.md`.

---

## 25. Accessibility Considerations

Inherited from `PRODUCT_UX_PRINCIPLES.md` §13 and `FORM_UX_SPECIFICATION_V1.md` §16, extended to every new V2 control:

- **Keyboard navigation:** every V2 control — capability toggles, `otp_required` sub-control, Step add/reorder/delete, Field-to-Step assignment, the Plan/Capability entry point's "View Plans" link — must be operable without a mouse, same as V1's field-builder controls.
- **Focus:** the `otp_required` control's conditional appearance (only when `otp_enabled = true`) must not trap or lose focus when it appears/disappears; focus should move predictably.
- **Labels:** OTP, Multi-step, and AI Qualification toggles need programmatically associated labels — not icon-only or placeholder-only controls, consistent with V1's field-label requirement.
- **Locked-state accessibility:** a locked capability control must convey its locked state and reason to assistive technology, not only via visual dimming/color — this is a direct extension of V1's "errors must be announced, not conveyed by color alone" principle to the new lock pattern.
- **Dynamic state changes:** the OTP challenge appearing, Step navigation advancing, and a downgrade notice appearing must all be perceivable by assistive technology, not only visually, consistent with V1's requirement for loading/success/error states.
- **Touch targets:** OTP verification controls and Step navigation controls on the public mobile surface must meet the same touch-target-size expectation as any other public form control.
- **OPEN, inherited unresolved from V1:** no formal accessibility conformance level (e.g., WCAG 2.1 AA) is confirmed platform-wide — this remains a platform-level gap, not newly introduced or resolved by V2.

---

## 26. Open UX Questions

Consolidated from throughout this document. None block the document's use as a UX specification; all are non-blocking, consistent with how every approved source in this chain has carried forward comparable open items.

| #   | Question                                                                                                                                                                                                   | Source section | Classification                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| 1   | Should the Form Editor surface a computed descriptive label (e.g., "This Form behaves like a Verified Form") anywhere in the UI, or keep the four descriptive names to documentation/explanatory use only? | §4             | Non-blocking, UX-copy/product-presentation decision                                          |
| 2   | Exact wording for the "Add a Phone field before enabling OTP" rejection message                                                                                                                            | §7.1           | Non-blocking, UX-copy                                                                        |
| 3   | Exact control type and copy for `otp_required` (toggle vs. radio pair, labeling)                                                                                                                           | §7.2           | Non-blocking, UX-presentation                                                                |
| 4   | Visitor-facing mechanics of an optional (`otp_required = false`) verification step (e.g., a skip affordance)                                                                                               | §7.2, §18      | Non-blocking, UX/interaction design, inherited from API doc                                  |
| 5   | Whether each Step carries its own title/subtitle distinct from the Form's                                                                                                                                  | §8.2           | Non-blocking, inherited from Data Requirements §E #1                                         |
| 6   | Exact Publish-time UX when a Multi-step Form's entitlement and structural validation interact at the same moment                                                                                           | §13            | Non-blocking, not fully specified by any approved source                                     |
| 7   | Whether editing a live, Published Form should show a confirmation/warning before an immediate-effect change (fields, capability toggles, Steps)                                                            | §15            | Non-blocking, inherited unresolved from V1 §20                                               |
| 8   | Downgrade-notice delivery mechanism (banner / notification-center / email)                                                                                                                                 | §16            | Non-blocking, inherited unresolved from PRD-002 §12.2                                        |
| 9   | Exact Qualification Category value set (e.g., Qualified / Needs Review / Low Priority vs. alternatives)                                                                                                    | §19            | Non-blocking, UX/business-stage, inherited from PRD-003 §15 #2                               |
| 10  | Where the Category/Explanation are surfaced in the Lead UI (Lead Detail vs. Leads List vs. elsewhere)                                                                                                      | §19            | Non-blocking, inherited from PRD-003 §12, §15 #5/#8                                          |
| 11  | Human override/correction of the AI Qualification Category                                                                                                                                                 | §19            | Non-blocking, inherited from PRD-003 §15 #9 — product-decision stage, not resolved here      |
| 12  | Whether a lightweight per-row capability indicator should appear on the Forms List                                                                                                                         | §1             | Non-blocking, not required or forbidden by any approved source                               |
| 13  | Exact placement of the Plan/Capability visibility entry point (Forms List vs. within Form Editor)                                                                                                          | §10            | Non-blocking, inherited from PRD-003 §9, "exact placement not yet decided"                   |
| 14  | Field-type change after creation (unrelated to V2, inherited gap)                                                                                                                                          | §6             | Non-blocking, inherited unresolved from V1 §20                                               |
| 15  | Admin mobile support level                                                                                                                                                                                 | §24            | Non-blocking, platform-wide open item, not V2-specific                                       |
| 16  | Formal accessibility conformance level (e.g., WCAG 2.1 AA)                                                                                                                                                 | §25            | Non-blocking, platform-wide open item, not V2-specific                                       |
| 17  | Whether Steps/Field-list reorder UI can share one underlying component                                                                                                                                     | §8.2, §22      | Non-blocking, implementation-time judgment call, not a product/UX decision                   |
| 18  | Reapplying an Experience preset to an already-customized Form — overwrite, confirm, or merge?                                                                                                              | §4.2           | Non-blocking, UX-interaction decision, not addressed by any approved source                  |
| 19  | Exact wording/interaction for selecting a locked Experience preset at creation time                                                                                                                        | §3             | Non-blocking, UX-copy, extends the existing locked-capability pattern (§11) to a new surface |

---

## 27. Traceability to Approved Sources

| Section here                   | PRD-001                   | PRD-002                    | PRD-003                  | FORMS-V1/V2-DATA-REQUIREMENTS | FORMS-V1/V2-API-BEHAVIORAL | FORM_UX_SPECIFICATION_V1 |
| ------------------------------ | ------------------------- | -------------------------- | ------------------------ | ----------------------------- | -------------------------- | ------------------------ |
| §1 Forms List                  | §9 (IA)                   | —                          | §9 (no new nav)          | —                             | —                          | §6                       |
| §2 Single/Multiple Forms       | §4.1 (multi-form support) | —                          | —                        | —                             | V1 §4.1                    | "DO NOT CARRY FORWARD"   |
| §3 Form Creation               | §13, §14                  | —                          | —                        | —                             | V1 §4.1                    | §7                       |
| §4 Experience Presentation     | —                         | —                          | §0, §2, §10.1, §14 #6    | §C.1, §C.2                    | V2 §6, §12.3               | —                        |
| §5 Form Editor                 | §13, §14                  | —                          | §9                       | §C.1                          | V2 §5                      | §7                       |
| §6 Field Builder               | §13, Data §7–§8           | —                          | —                        | §C.3                          | V1 §4.3–§4.4               | §7                       |
| §7 OTP Configuration           | —                         | §10.1, §10.2, §12.1, §12.3 | §10.1, §15 #1 (resolved) | §C.2                          | V2 §12                     | —                        |
| §8 Multi-step Editor           | —                         | §10.1, §11.1               | §10.2                    | §C.3, §C.8                    | V2 §13                     | —                        |
| §9 AI Qualification Config     | —                         | §10.1, §11.1               | §9, §10.3                | §C.4                          | V2 §14                     | —                        |
| §10 Plan/Capability Visibility | —                         | §9, §14                    | §10.4, §13               | §C.6                          | V2 §15                     | —                        |
| §11 Locked States              | —                         | §10.1, §10.2, §12.1        | §11, §12                 | —                             | V2 §9, §10                 | —                        |
| §12 Preview                    | —                         | —                          | §12, §15 #5              | —                             | —                          | §8                       |
| §13 Publish                    | §14                       | —                          | —                        | §C.8                          | V1 §4.9, V2 §13.4          | —                        |
| §14 Embed/Widget               | §11, §12                  | —                          | §9 (embed-code row)      | —                             | V2 §14                     | —                        |
| §15 Published Form Editing     | §14 (B1)                  | §12.3                      | —                        | §C.8                          | V2 §16                     | —                        |
| §16 Downgrade/Fallback         | —                         | §11.1, §12.2               | §10.1–§10.3              | §C.7                          | V2 §11, §17                | —                        |
| §17 Entitlement Restoration    | —                         | §12.1                      | —                        | §C.7 (decision #8)            | V2 §11                     | —                        |
| §18 Public Form Behavior       | §15, §21                  | —                          | §10.1–§10.2              | §22                           | V1 §7–§10, V2 §12.2, §13.3 | §10                      |
| §19 Submission→Lead→AI         | §16                       | —                          | §10.3, §14               | §C.4                          | V1 §10, V2 §14             | —                        |
| §24 Responsive                 | —                         | —                          | —                        | —                             | —                          | §15                      |
| §25 Accessibility              | —                         | —                          | —                        | —                             | —                          | §16                      |

---

## APPROVAL STATUS

**This document is DRAFT — AWAITING YOUR REVIEW.** No PRD, Data Requirements document, or API Behavioral Requirements document has been reopened or modified. No implementation code, component code, or visual design file has been produced. Every screen and behavior above traces to an approved source or is explicitly marked OPEN; nothing was invented where a source was silent.

Per your instruction, this document stops here for your review.
