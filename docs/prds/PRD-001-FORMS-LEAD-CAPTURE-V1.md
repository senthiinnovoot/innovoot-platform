# PRD-001 — Forms / Lead Capture V1

**Status:** APPROVED — IMPLEMENTATION READY
**Type:** Product Requirements Document (product specification, not technical design)
**Owner:** Innovoot Product Planning
**Sources of authority:** PRODUCT_LANDSCAPE.md · PRODUCT_DEVELOPMENT_STRATEGY.md · DATA_PRIVACY_PRINCIPLES.md · PLANNING_BASELINE.md · Forms/Lead Capture discovery (this project, prior session)
**Legacy status:** InnoForms/Admin documentation used as evidence only. No legacy architecture, schema, API, or UX is carried forward.

---

## 1. Document Status & Decision History

| Round | Decision                                                                                                                                                                                                                                                                      | Source                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1     | Multiple forms per tenant                                                                                                                                                                                                                                                     | Discovery, confirmed                                                             |
| 2     | Publish as embeddable widget **and** hosted/shareable page                                                                                                                                                                                                                    | Discovery, confirmed                                                             |
| 3     | Every valid submission auto-creates a Lead                                                                                                                                                                                                                                    | Discovery, confirmed                                                             |
| 4     | Lead is a reusable platform concept, not Forms-owned                                                                                                                                                                                                                          | Discovery, confirmed                                                             |
| 5     | Lead status: New → Contacted → Closed                                                                                                                                                                                                                                         | Discovery, confirmed                                                             |
| 6     | No lead assignment/ownership in V1                                                                                                                                                                                                                                            | Discovery, confirmed                                                             |
| 7     | Basic email notification on new Lead                                                                                                                                                                                                                                          | Discovery, confirmed                                                             |
| 8     | Basic spam/abuse protection required (mechanism undecided)                                                                                                                                                                                                                    | Discovery, confirmed                                                             |
| 9     | Leads is a **separate Admin module**, not nested in Forms                                                                                                                                                                                                                     | Discovery, confirmed                                                             |
| 10    | Branding is tenant-level only; per-form branding is OUT OF SCOPE                                                                                                                                                                                                              | Discovery, confirmed                                                             |
| 11    | Forms V1 data boundary: ordinary contact/lead data only, no medical/health data                                                                                                                                                                                               | Discovery, confirmed; ratified in DATA_PRIVACY_PRINCIPLES §17                    |
| 12    | Analytics, OTP forms, multi-step forms, conditional fields, lead scoring, assignment, marketing integration, payment collection, automation triggers, OPS surface, data export — all OUT OF SCOPE for V1                                                                      | Discovery, confirmed                                                             |
| —     | **"FORMS V1 IS READY FOR PRD"** — discovery closed with no material blockers                                                                                                                                                                                                  | Discovery, final round                                                           |
| 13    | Widget display mode: **inline only** for V1. Rendering model kept extensible for future display modes (popup/modal/etc.), but none are built now.                                                                                                                             | PRD-001 update, post legacy-UX review, confirmed                                 |
| 14    | CTA/submit button text is **configurable per form**, default "Submit". No CTA styling customization — styling stays with the shared design system and tenant branding.                                                                                                        | PRD-001 update, post legacy-UX review, confirmed                                 |
| 15    | An **optional Consent/Notice checkbox field type** is added to the V1 field set. Not mandatory per form; business configures label/notice text and required/optional. No legal-policy or custom privacy framework introduced — stays consistent with DATA_PRIVACY_PRINCIPLES. | PRD-001 update, post legacy-UX review, confirmed — closes prior Open Decision #1 |
| 16    | Admin module is named **"Leads"**, not "Leads & CRM".                                                                                                                                                                                                                         | PRD-001 update, post legacy-UX review, confirmed                                 |
| 17    | PostgreSQL is **confirmed** for the new Innovoot backend. The MySQL reference in PLANNING_BASELINE.md is legacy/base-kit evidence, not an approved decision for the new backend, and does not override PRODUCT_DEVELOPMENT_STRATEGY's clean-slate framing.                    | PRD-001 update, confirmed — closes prior Open Decision #7                        |
| 18    | Spam/abuse rejection shows visitors a generic error ("We couldn't submit your request. Please try again.") that never discloses spam/abuse classification.                                                                                                                    | PRD-001 update, confirmed — closes prior Open Decision #2                        |
| 19    | A published form can be unpublished; existing embed snippets/hosted links remain technically valid but show "This form is no longer available."                                                                                                                               | PRD-001 update, confirmed — closes prior Open Decision #3                        |
| 20    | Notifications use one tenant-level email in V1; no per-form notification recipients.                                                                                                                                                                                          | PRD-001 update, confirmed — closes prior Open Decision #4                        |

This PRD does not reopen any of the above. Where this PRD introduces a new decision point not covered above, it is explicitly labeled **OPEN**.

**Legacy UX evidence note:** A review of legacy InnoForms/Admin screenshots (Admin Forms list, Smart Form customization screen) was conducted against this PRD. Useful interaction patterns — the field-builder (type dropdown, required toggle, reorder, duplicate/delete), live preview alongside editing, embed-code presentation, and breadcrumb navigation — are retained as evidence for the later UX/IA design phase only, not as PRD requirements. Legacy pricing tiers, the "Form Mode: Single/Multiple" toggle, the paywalled "Forms Comparison" table, per-form branding toggles, and template-selection architecture are explicitly not carried forward and do not appear anywhere in this PRD.

---

## 2. Problem Statement

Tenant businesses on Innovoot have no way to capture interest from visitors on their public web presence and turn it into an actionable record inside Innovoot, without manual re-entry. This is true for every vertical (Healthcare, Hospitality, and future verticals) — it is not vertical-specific behavior, which is why Forms/Lead Capture is a Core Platform Capability rather than a vertical module.

## 3. Product Goal

Let a tenant business create a simple lead-capture form, publish it publicly, and see every submission as a Lead they can act on inside Admin — with the smallest possible surface area for V1.

## 4. Target Users / Roles

| Role                          | Experience           | Does                                                                     |
| ----------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Business/tenant administrator | Admin                | Creates/edits/publishes forms, views and updates Leads                   |
| Business staff                | Admin                | Views and updates Leads (same permission tier as admin for V1 — see §24) |
| Public/end customer (visitor) | Widget / Hosted page | Fills and submits a form; has no account, no login                       |

**No OPS role in V1.** Per confirmed scope, an OPS-level Forms/Leads surface is OUT OF SCOPE. OPS's platform-wide support access (per DATA_PRIVACY_PRINCIPLES §6) is a platform capability, not a Forms-specific feature — this PRD does not design an OPS view.

## 5. Jobs-to-be-Done / Primary Use Cases

1. "I want to put a contact form on my website and get notified when someone fills it out."
2. "I want a shareable link to a form I can send directly (e.g. via WhatsApp, SMS, social bio) without needing my own website."
3. "I want to see everyone who's submitted a form in one place, and mark who I've followed up with."
4. "I want my forms to look like my business, not like a generic tool."

## 6. Scope (MUST HAVE — V1)

- Create/edit/manage **multiple** forms per tenant (title, fields, required/optional, field order)
- Form fields limited to ordinary contact/lead data (§28)
- Publish each form as: (a) an embeddable widget, **and/or** (b) an Innovoot-hosted shareable page
- Public form: render, client-side validate, submit, success/error state
- Basic spam/abuse protection on submission (mechanism not decided here — technical planning)
- Tenant data isolation (platform requirement, not Forms-specific — DATA_PRIVACY_PRINCIPLES §4)
- Every valid submission automatically creates a Lead (status: New)
- **Leads as a separate Admin module**: list (filterable by source form) + detail view, manual status transitions
- Basic email notification to the business on new Lead
- Tenant-level branding (logo + primary color) applied to all public form surfaces, via the shared Innovoot design system

## 7. Out of Scope (V1)

| Excluded                                         | Why                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| OTP/verified forms                               | Deferred — adds verification complexity not justified for V1                      |
| Multi-step/conversion forms                      | Deferred — single-step covers the core JTBD                                       |
| Conditional/smart fields                         | Deferred — adds form-logic complexity                                             |
| Lead scoring/qualification                       | Deferred — no scoring model defined yet                                           |
| Lead assignment/ownership                        | Deferred — no team/routing concept yet                                            |
| Marketing integrations                           | Deferred — no integration platform decided                                        |
| Payment collection via forms                     | Deferred — separate capability                                                    |
| WhatsApp/automation triggers                     | Deferred — separate capability                                                    |
| OPS Forms/Leads surface                          | Deferred — no OPS support tooling defined yet                                     |
| Analytics (views, submission counts, conversion) | Explicitly deferred per discovery                                                 |
| Data export                                      | Platform-wide future capability (DATA_PRIVACY_PRINCIPLES §11); not Forms-specific |
| Per-form branding override                       | Explicitly deferred; tenant-level branding only                                   |
| Any Lead source other than Forms                 | No CRM, no multi-source lead design in V1                                         |
| Medical/health data collection                   | Deferred to Healthcare Appointment PRD; explicit boundary (§28, §22)              |

## 8. User Journeys

### 8.1 Primary journey — business creates and publishes a form

```
Admin: Business creates a form (title, fields, order, required/optional)
   → Business publishes it (embeddable widget and/or hosted page)
      → Business copies embed snippet and/or shareable link
```

### 8.2 Primary journey — visitor submits, lead is created

```
Visitor opens form (on tenant site via widget, or via hosted link)
   → Fills fields → client validates → submits
      → Spam/abuse check → passes → submission stored
         → Lead auto-created (status: New) in Leads module
            → Business receives email notification
```

### 8.3 Primary journey — business manages a lead

```
Business opens Leads module → filters by source form (optional)
   → Opens a Lead's detail view → sees submitted field data + source form + timestamp
      → Manually updates status: New → Contacted → Closed
```

### 8.4 Failure journey — invalid/spam submission

```
Visitor submits → client or server validation fails
   → Inline field-level error shown → no submission stored → no Lead created
```

```
Visitor submits → flagged as spam/abuse
   → Submission is rejected; visitor sees a generic error message that does not disclose the classification
   → No Lead created
```

## 9. Information Architecture

Two distinct, related Admin modules — this is a settled decision (discovery round 9), not open:

```
Admin
├── Forms          (create/manage/publish forms)
└── Leads          (view/manage leads from all sources — V1: Forms only)
```

- **Forms** is where a business defines _what_ is asked and _where_ it's published.
- **Leads** is where a business sees _who_ responded, across all lead sources (V1: Forms is the only source, but the module is not Forms-owned).
- A Lead detail view links back to its source Form; a Form does not "contain" its leads as a nested view.

**ASSUMPTION:** Forms and Leads appear as top-level sibling items in Admin navigation. Confirm during UX/IA design if a different grouping (e.g. under a shared "Engagement" parent) is preferred — this is a navigation-labeling choice, not a product-scope decision, so it's flagged as an assumption rather than blocking this PRD.

## 10. Admin Experience

Admin is where the business/tenant administrator and staff work. Scope for Forms/Leads in Admin:

- **Forms module:** list of forms → create/edit a form → publish a form → view publish details (embed snippet, hosted link)
- **Leads module:** list of leads (filterable by source form) → lead detail (submitted data, source, timestamp, status) → status update

Both modules operate within the authenticated, tenant-scoped Admin experience — no new authentication model is introduced by this PRD (authentication architecture is explicitly not decided yet per PRODUCT_DEVELOPMENT_STRATEGY §9).

## 11. Public Widget Experience

The embeddable form, rendered inside a tenant's own website via a script/embed mechanism (exact mechanism is a technical decision, not designed here — see §29).

**Product behavior required:**

- Renders the tenant's published form with tenant branding applied
- No login required for the visitor
- Functions inside third-party page contexts (i.e., must not depend on the tenant's site behavior)
- **Display mode: inline only for V1.** The form renders directly in the page flow where it's embedded. Popup, modal, slide-in, floating-launcher, and other display modes are explicitly not built in V1. The rendering model should be kept extensible so additional display modes can be considered later, but no other mode is in V1 scope.

## 12. Hosted Form Experience

An Innovoot-hosted page for the same form, reachable via a shareable link — no tenant website required.

**Product behavior required:**

- Same form, same validation, same branding, same submission → Lead behavior as the embedded widget
- Standalone page (not dependent on being embedded anywhere)
- Shareable via direct link (e.g. messaging apps, social bio, email)

### 12.1 Shared vs. differing behavior across the two public surfaces

| Aspect                            | Embedded Widget                     | Hosted Page                                         | Same?       |
| --------------------------------- | ----------------------------------- | --------------------------------------------------- | ----------- |
| Form definition rendered          | Yes                                 | Yes                                                 | Same        |
| Validation rules                  | Yes                                 | Yes                                                 | Same        |
| Branding applied                  | Yes                                 | Yes                                                 | Same        |
| Submission → Lead behavior        | Yes                                 | Yes                                                 | Same        |
| Spam/abuse protection             | Yes                                 | Yes                                                 | Same        |
| Hosting context                   | Embedded in tenant's own site       | Standalone Innovoot-hosted URL                      | **Differs** |
| Requires tenant to have a website | Yes                                 | No                                                  | **Differs** |
| Page chrome (header/footer)       | None — inherits tenant page context | Minimal Innovoot-hosted page chrome around the form | **Differs** |

**ASSUMPTION:** The hosted page has minimal neutral chrome (e.g. tenant logo + form, no Innovoot marketing chrome). Confirm during UX design.

## 13. Form Creation & Configuration

A form has:

- A title (business-facing label)
- An ordered list of fields, each with: field type, label, required/optional
- A submit/CTA button label, configurable per form, defaulting to **"Submit"** if not set. No CTA styling customization (color, size, shape) — CTA appearance follows the shared design system and tenant branding, only its text is configurable.
- A published state (draft until explicitly published — see §14)

Field types for V1 (confirmed set):

| Field type              | Notes                                |
| ----------------------- | ------------------------------------ |
| Text                    | Short free text                      |
| Textarea/message        | Long free text                       |
| Email                   | Format-validated                     |
| Phone                   | Format expectations = OPEN (see §33) |
| Select/dropdown         | Fixed option list, business-defined  |
| Consent/Notice checkbox | Optional field type — see below      |

Field-level validation errors are shown inline, at the point of the offending field, without discarding already-entered valid field values (see §21).

**Consent/Notice checkbox (confirmed):** an optional field type a business may add to a form when they want an explicit opt-in (e.g. "I agree to be contacted about my enquiry"). Not mandatory on every form. The business configures the label/notice text and whether the field is required. This field does not introduce a legal-policy configuration surface or a custom privacy framework inside Forms — it is a plain checkbox field like any other, and must remain consistent with the platform-wide DATA_PRIVACY_PRINCIPLES (§23) rather than defining its own consent semantics.

## 14. Form Publishing

- A form is created in an unpublished/draft state and must be explicitly published before it can be embedded or shared.
- Publishing produces both artifacts as applicable: an embed snippet (for the widget) and a shareable URL (for the hosted page) — the business may use either, both, or neither once published.
- **A published form can be unpublished (confirmed).** Existing embed snippets and hosted links remain technically valid (they are not broken or invalidated) but, once unpublished, both surfaces display a clear "This form is no longer available" state to any visitor who reaches them, instead of the form.

## 15. Form Submission

- Visitor fills the form, client-side validation runs on submit (required fields, field-type format).
- On successful validation, the submission is checked for spam/abuse (mechanism undecided, §22) and then stored.
- A confirmation/success state is shown to the visitor on successful submission.
- A clear error state is shown on validation failure or rejected/failed submission, without losing entered data.
- If a submission is rejected as spam/abuse, the visitor sees a generic error message (e.g. "We couldn't submit your request. Please try again.") — the visitor-facing message never reveals that the rejection was due to spam/abuse classification (see §21, §22).

## 16. Lead Creation

- Every submission that passes validation and spam/abuse checks automatically becomes a Lead. There is no manual "promote submission to lead" step, and no submission review queue in V1.
- A Lead carries: the submitted field values, its source form, a creation timestamp, and a status.

## 17. Lead Lifecycle

- Fixed statuses for V1: **New → Contacted → Closed**
- Transitions are manual (business updates status in the Leads module); no automatic status changes in V1.
- No assignment/ownership field in V1 — any authorized staff member can update any Lead's status (see §24).

## 18. Lead List & Detail

- **List:** all Leads for the tenant, filterable by source form. Each row shows enough to identify and triage a lead (e.g. name/primary contact field, source form, status, date) — exact column set is a UX/IA design decision, not fixed here.
- **Detail:** full submitted field data, source form, timestamp, current status, status-update control.

## 19. Notifications

- A basic email notification is sent to the business when a new Lead is created.
- **Confirmed:** V1 uses **one tenant-level notification email**. Notifications are not configurable per form, and there is no per-user notification routing in V1.
- No other notification channels (SMS, push, in-app) are in scope for V1.

## 20. Branding

- Tenant-level only: one logo + one primary color, applied uniformly across all of a tenant's forms and both public surfaces.
- Sourced from the shared Innovoot design system's theming mechanism — no form-specific or custom CSS/theme architecture is introduced by Forms.
- Per-form branding overrides are explicitly OUT OF SCOPE.

## 21. Validation & Error States

| State                                                | Behavior                                                                                                                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing required field                               | Inline error at the field, submission blocked                                                                                                               |
| Invalid format (email/phone)                         | Inline error at the field, submission blocked                                                                                                               |
| Spam/abuse detected                                  | Submission rejected; visitor sees a generic error ("We couldn't submit your request. Please try again.") that does not reveal the spam/abuse classification |
| Network/server error on submit                       | Visible error state; entered data preserved so the visitor can retry                                                                                        |
| Successful submission                                | Clear success confirmation shown                                                                                                                            |
| Form unpublished (visitor reaches a live link/embed) | "This form is no longer available" state shown instead of the form                                                                                          |

## 22. Spam/Abuse Requirements

- Basic spam/abuse protection is a **required** product behavior for V1.
- The technical mechanism (e.g. honeypot field, rate limiting, CAPTCHA, server-side heuristics) is explicitly **not decided in this PRD** — that belongs to technical/API design.
- Product requirement: a spam/abuse-flagged submission must not create a Lead and must not count as a successful business notification trigger.
- **Confirmed:** the visitor-facing rejection message is generic (e.g. "We couldn't submit your request. Please try again.") and must not disclose that a submission was classified as spam or abuse — this is a product requirement to avoid coaching bad actors, independent of whatever detection mechanism is later chosen.

## 23. Privacy / Data Requirements

Forms V1 operates inside the platform-wide DATA_PRIVACY_PRINCIPLES, which take precedence over anything stated here if a conflict is ever found. Key applicable principles, narrowed to Forms V1:

- **Data boundary (DATA_PRIVACY_PRINCIPLES §17):** Forms V1 collects ordinary contact/lead data only (name, email, phone, message-type fields). It must not intentionally collect medical/health or other sensitive/special-category data. Field-type configuration (§13) must stay consistent with this boundary — this is why Forms V1's field set is deliberately minimal and business-facing "free text" fields are message/textarea, not open-ended structured medical intake.
- **Controller/processor model (§3):** Innovoot acts as processor, the tenant business as controller, for lead data submitted through a tenant's forms.
- **Consent/notice (§9):** Required "where applicable." V1 provides an optional Consent/Notice checkbox field type (§13) so a business can meet this where its form warrants it; Forms does not mandate consent language or enforce when consent is "applicable" — that judgment stays with the business, consistent with Forms not owning a legal-policy framework.
- **Tenant isolation (§4):** Mandatory, platform-wide, not Forms-specific.
- **Retention/deletion (§7, §8):** Platform-defined defaults apply; exact periods are not yet defined platform-wide and are **not a Forms V1 blocker** per the discovery's resolution, but remain a dependency for implementation planning.
- **Audit logging (§12):** Required as a platform capability from the start for personal-data access/changes/deletion — Forms' Lead-status changes and Lead data access should be captured consistent with this, without requiring an audit UI in V1.
- **Data export (§11):** Explicitly out of scope for Forms V1.
- **Children's data (§15):** No special handling required for Forms V1's data scope.

## 24. Permissions & Tenant Isolation

- Tenant data isolation is mandatory and platform-wide (not designed per-capability).
- **ASSUMPTION:** within a tenant, all Admin users (administrator and staff) have equal read/write access to Forms and Leads in V1 — there is no granular Forms/Leads-specific permission tier. This follows from "no lead assignment/ownership in V1" (confirmed decision) and the absence of any granular role model elsewhere in current platform documentation.
- **OPEN:** Does the platform have (or plan) a general staff-vs-administrator permission distinction that Forms/Leads should inherit once it exists? Not a V1 blocker given the assumption above, but worth surfacing for future-proofing.

## 25. Responsive / Mobile Requirements

- Both public surfaces (embedded widget and hosted page) must be usable on mobile viewports, since form traffic will substantially come from mobile visitors reached via shared links.
- Admin's Forms and Leads modules should follow whatever responsive baseline the Innovoot Base Kit/design system already establishes for Admin generally — this PRD does not introduce a Forms-specific responsive requirement beyond that baseline.

## 26. Accessibility Requirements

- Public forms (both surfaces) must support keyboard navigation, visible focus states, and screen-reader-readable labels/errors for all field types — this is a baseline expectation for any public-facing data-collection surface, not a Forms-specific innovation.
- Admin's Forms/Leads screens should meet whatever accessibility baseline the shared design system already establishes.
- **ASSUMPTION:** no formal accessibility conformance level (e.g. WCAG 2.1 AA) has been confirmed platform-wide. Flagging as a platform-level gap, not something to resolve inside this PRD.

## 27. Empty / Loading / Error States

| Context                                  | State needed                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Forms module, no forms yet               | Empty state with a clear "create your first form" action                                        |
| Leads module, no leads yet               | Empty state, distinguishing "no forms published yet" from "forms published, no submissions yet" |
| Lead list loading                        | Loading state                                                                                   |
| Lead detail — not found/removed          | Error state                                                                                     |
| Form publish action fails                | Error state, retry path                                                                         |
| Public form — form not found/unpublished | Visitor-facing error/"not available" state                                                      |

## 28. Data Requirements — Conceptual Only

No database design here. Three related but distinct concepts:

| Concept        | What it represents                                                      | Who creates it                | Lifecycle                                                                                       |
| -------------- | ----------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| **Form**       | The business's definition of what to ask (title, fields, publish state) | Business, in Admin            | Draft → Published → Unpublished (form itself is retained; only its public availability changes) |
| **Submission** | One visitor's raw response to a Form at a point in time                 | Visitor, via a public surface | Created once, immutable record of what was submitted                                            |
| **Lead**       | The business-actionable record derived from a valid Submission          | System, automatically         | New → Contacted → Closed                                                                        |

**Relationship:** A Form has many Submissions over time. Each valid Submission produces exactly one Lead in V1 (1:1 in V1 only, because Forms is the sole Lead source — this is why Lead is modeled as its own concept rather than as a Submission that a business logic layer decorates with a status). A Lead references its source Form. Submissions that fail validation or are flagged as spam do not produce a Lead, and their retention status is not yet defined (see §33).

Data content is bounded to: form structure/metadata, field values submitted, lead status, timestamps, source form reference, tenant reference. No medical/health data. No payment data.

## 29. API Requirements — Behavioral Contracts Only

No endpoint design. Behavioral contracts the backend must satisfy:

- A tenant-authenticated capability to create/edit/list/publish Forms, scoped to that tenant only.
- An unauthenticated (public) capability to fetch a published Form's structure and branding, for rendering on both public surfaces.
- An unauthenticated (public) capability to submit Form responses, which performs validation and spam/abuse checks and, on success, creates a Submission and a Lead, and triggers the business notification.
- A tenant-authenticated capability to list/filter/view/update Leads, scoped to that tenant only.
- All tenant-scoped operations must enforce tenant isolation; all public operations must resolve to the correct tenant/form without exposing other tenants' data.

## 30. Design-System Requirements

- Forms/Leads (Admin, Widget, and Hosted surfaces) must use the shared Innovoot design system exclusively — tokens, typography, color, spacing, components, states, accessibility and responsive rules.
- Tenant branding (logo + primary color) is applied through the design system's existing theming mechanism.
- No Forms-specific CSS/theme architecture, and no per-form theme overrides, are introduced.

## 31. Acceptance Criteria

- A tenant can create, edit, and publish multiple forms, each with an ordered set of fields from the approved V1 field-type list, including the optional Consent/Notice checkbox where a business chooses to add it.
- A form's CTA/submit button text is configurable; if left unset, it defaults to "Submit."
- A published form is reachable via an embeddable widget (inline display only) and/or a hosted shareable page, per the business's choice, rendered with the tenant's branding.
- If a Consent/Notice checkbox is added and marked required, a submission cannot succeed without it being checked.
- A visitor can successfully submit a valid form on both surfaces and sees a success state; an invalid submission is blocked with inline errors and no Lead is created.
- A submission flagged as spam/abuse does not create a Lead, and the visitor sees only a generic error message that does not disclose the spam/abuse classification.
- A business can unpublish a previously published form; existing embed snippets and hosted links continue to resolve (they are not broken), but visitors reaching them see a "This form is no longer available" state instead of the form.
- Every valid submission creates exactly one Lead, correctly attributed to its source form and tenant, with initial status New.
- The business receives an email notification, sent to the single tenant-level notification email, when a new Lead is created.
- Leads appear in a dedicated Leads module (not nested inside Forms), filterable by source form, with a working list and detail view.
- A business can manually transition a Lead's status across New → Contacted → Closed.
- No tenant can view or act on another tenant's forms, submissions, or leads.
- No field, screen, or stored data in this feature intentionally captures medical/health information.

## 32. Non-Functional Product Requirements

- **Tenant isolation** is a hard platform requirement, not a Forms-specific one (§24).
- **Availability of public surfaces:** the embedded widget and hosted page are the tenant's storefront for lead capture — they should degrade gracefully (e.g. clear error rather than silent failure) if the backend is unreachable, since a broken public form directly costs the tenant leads.
- **No PII beyond the declared boundary** (§23) is collected by product design.
- Performance, uptime, and specific SLAs are not defined in this PRD — technical/architecture concern.

## 33. Open Decisions

| #   | Question                                                                                                                                                                                                                                                                             | Blocking?                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 5   | Retention of failed/spam-flagged submissions — kept for audit or discarded? (§28)                                                                                                                                                                                                    | Not blocking V1 build; relevant to platform retention policy once defined                                         |
| 6   | General Admin permission model (administrator vs. staff distinction) — does Forms/Leads need to anticipate this? (§24)                                                                                                                                                               | Not blocking V1; future-proofing only                                                                             |
| 8   | No `forms` module currently exists in the Innovoot Base Kit's module list (`appointments, auth, business-context, customers, dashboard, leads, marketing, orders, payments, products, seo, services, settings`) — a `leads` module placeholder already exists, but `forms` does not. | Technical/architecture note, not a product decision — flagged for whoever scaffolds the module, not decided here. |

**Item 1 (consent/notice checkbox field type) is CLOSED** — resolved via decision round 15 (§1); reflected in §13 and §31.

**Item 2 (spam/abuse rejection UX) is CLOSED** — resolved: visitor sees a generic error ("We couldn't submit your request. Please try again.") that never discloses spam/abuse classification. Reflected in §15, §21, §22, §31.

**Item 3 (form unpublishing) is CLOSED** — resolved: a published form can be unpublished; existing embed snippets/links remain technically valid but show "This form is no longer available." Reflected in §14, §21, §31.

**Item 4 (notification recipient) is CLOSED** — resolved: one tenant-level notification email for V1, no per-form recipients. Reflected in §19, §31.

**Item 7 (PostgreSQL/MySQL conflict) is CLOSED** — resolved: PostgreSQL is confirmed for the new Innovoot backend. The MySQL reference in PLANNING_BASELINE.md is legacy/base-kit evidence describing the old system's stack, not an approved decision for the new backend, and does not override PRODUCT_DEVELOPMENT_STRATEGY's clean-slate framing. This is a technology confirmation, not a product-scope change, and no implementation detail is introduced by this PRD as a result.

Only items #5, #6, and #8 remain open. None of them block PRD approval or implementation-readiness — they are non-blocking notes carried forward for future/technical planning.

## 34. Future Considerations

- Analytics on form views/submissions/conversion (explicitly deferred)
- Additional Lead sources beyond Forms, once Lead is used by other capabilities
- Per-form branding, if a real business need emerges
- Data export (platform-wide capability, not Forms-specific)
- Lead assignment/ownership, once a team/routing concept exists
- OTP-verified and multi-step forms, if justified by a concrete use case
- OPS-level Forms/Leads support surface

## 35. Implementation-Readiness Checklist

| Item                                                                      | Status                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------- |
| Business problem, goal, users defined                                     | Done                                              |
| Scope / out-of-scope confirmed                                            | Done                                              |
| User journeys defined                                                     | Done                                              |
| Information architecture decided (Forms + Leads as separate modules)      | Done                                              |
| Field types identified (confirmed set, including Consent/Notice checkbox) | Done                                              |
| Widget display mode decided (inline only, V1)                             | Done                                              |
| CTA/submit button text requirement decided                                | Done                                              |
| Form unpublishing behavior decided                                        | Done                                              |
| Spam/abuse visitor-facing UX decided                                      | Done                                              |
| Notification recipient model decided                                      | Done                                              |
| Backend database technology conflict resolved (PostgreSQL confirmed)      | Done                                              |
| Data requirements — conceptual model                                      | Done                                              |
| API requirements — behavioral contracts                                   | Done                                              |
| Design-system requirements                                                | Done                                              |
| Privacy/data boundary consistency-checked                                 | Done — see §36                                    |
| Acceptance criteria drafted                                               | Done                                              |
| Open decisions resolved                                                   | **3 non-blocking items remain** (§33: #5, #6, #8) |
| PRD status                                                                | **DRAFT — READY FOR APPROVAL**                    |

**This PRD is now materially complete.** All product/UX-affecting open decisions are resolved. The 3 remaining open items (#5, #6, #8) are non-blocking technical/future-planning notes and do not prevent this PRD from being marked APPROVED / IMPLEMENTATION READY.

---

## 36. PRD Consistency Check

**Against PRODUCT_LANDSCAPE.md:**

- Forms/Lead Capture is confirmed as the first Core Platform Capability and the first through the PRD process — consistent.
- Admin/OPS/Widget three-experience model is respected; this PRD deliberately excludes an OPS surface, consistent with "OPS Forms/Leads surface is OUT OF SCOPE."
- No vertical-specific behavior is introduced — Forms remains usable by any tenant regardless of vertical, consistent with its status as a Core Platform Capability.
- No conflict found.

**Against DATA_PRIVACY_PRINCIPLES.md:**

- Forms V1's data boundary (§23, §28) matches DATA_PRIVACY_PRINCIPLES §17 exactly (ordinary contact/lead data; no medical/health data).
- Controller/processor framing (§23) matches §3.
- Data export exclusion (§7) matches §11.
- Audit logging expectation (§23) is stated as a principle to design toward, not a new UI requirement, consistent with §12's "does not require an audit UI in every V1 module."
- Consent/notice is addressed via the optional Consent/Notice checkbox field type (§13), consistent with §9 stating consent is "required where applicable" without the platform prescribing form-level mechanics or a legal-policy framework at the Forms level.
- No conflict found within data/privacy scope.

**Against PRODUCT_DEVELOPMENT_STRATEGY.md:**

- PostgreSQL is confirmed as the backend database technology for the new Innovoot platform (§1 decision 17, §33), consistent with this document's clean-slate mandate that the new database and APIs are derived from approved product requirements, not from legacy systems or from the base kit's currently-documented (but not product-approved) backend assumptions.
- No remaining technology conflict. This PRD does not otherwise specify implementation details — the PostgreSQL confirmation is a technology decision, not a database or API design, and no schema/endpoint content has been introduced here.

---

_End of PRD-001. APPROVED — IMPLEMENTATION READY as of 2026-08-22. All product/UX-affecting decisions are resolved and ratified. Items #5, #6, and #8 in §33 remain open but non-blocking and do not gate implementation._
