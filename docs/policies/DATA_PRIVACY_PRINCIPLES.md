STATUS: APPROVED
TYPE: INTERNAL PRODUCT / DATA GOVERNANCE
SCOPE: PLATFORM-WIDE

# Innovoot — Data & Privacy Principles

This document consolidates the approved product-level decisions from the Platform Privacy /
Data Requirements discovery. It defines how Innovoot, as a platform, must treat personal data
across all capabilities (Forms, and future capabilities including Healthcare).

---

## 1. PURPOSE

This document establishes the internal product and data-governance principles that all
Innovoot capabilities must be built against. It exists to ensure that product, PRD, and
implementation decisions about personal data are made consistently across capabilities and
verticals, rather than being decided ad hoc by each module.

This document is **not**:

- A customer-facing legal Privacy Policy
- A compliance certification against any specific law or regulation (e.g. GDPR, DPDP, HIPAA)
- A technical security specification
- A database or API design document

Any customer-facing legal Privacy Policy, terms of service, or compliance program must be
authored separately, by qualified legal counsel, and may formalize, narrow, or extend the
principles stated here.

## 2. SCOPE

Applies platform-wide, across all three experiences (Admin, OPS, Widget) and all verticals
(Healthcare, Hospitality, and any future vertical). It applies to:

- Data Innovoot collects about business customers (tenants)
- Data tenants collect about their public/end customers through Innovoot capabilities
- Internal platform data used for operating and supporting the platform (OPS)

Individual capabilities (e.g. Forms) may further restrict what data they are allowed to
collect, as documented in their own PRDs. A capability PRD may narrow this document's
principles for its own data scope, but may not override or weaken them.

## 3. DATA RESPONSIBILITY / WORKING CONTROLLER-PROCESSOR MODEL

Innovoot operates under the following **working product architecture assumption**, describing
who is functionally responsible for what data:

- **Innovoot is the controller** of business-customer (tenant account) data — i.e. the data
  Innovoot collects to operate accounts, billing-adjacent records, and platform administration.
- **Innovoot acts as processor, and the tenant business acts as controller**, for
  public/end-customer data that a tenant collects through Innovoot capabilities (e.g. Forms
  submissions, and later Healthcare patient data). The tenant determines why that data is
  collected and how it is used in their business; Innovoot processes and stores it on the
  tenant's behalf and within the tenant's configuration of the platform.

**This is a working product architecture assumption, not a final legal characterization.** It
is intended to guide product and engineering decisions about access, deletion, and data flows.
It remains subject to appropriate legal review, and may be refined once that review occurs.

## 4. TENANT DATA ISOLATION

Tenant data isolation is a non-negotiable platform requirement:

- No tenant may ever access, view, or receive another tenant's data, under any capability,
  without exception.
- Every capability that stores tenant-scoped or end-customer data must enforce isolation at
  the data-access level, not only at the UI level.
- This applies equally to Admin and Widget experiences. Public/widget-facing endpoints must
  resolve the correct tenant context and must not allow cross-tenant data leakage.

This requirement carries forward as a hard constraint on all future PRDs and technical design;
it is not itself subject to product trade-off discussion per capability.

## 5. ACCESS TO PERSONAL DATA

- Access to personal data (both tenant account data and end-customer data) must be scoped to
  the minimum necessary for the role requesting it.
- Tenant/business users (Admin experience) may access personal data belonging to their own
  tenant only.
- Access must be attributable — the platform must be able to identify, at a principle level,
  who accessed or changed personal data (see §12, Audit Logging).
- Exact access-control mechanisms (roles, permissions, technical enforcement) are an
  implementation concern for each capability's PRD and technical design, not decided here.

## 6. OPS ACCESS RULES

- OPS (Innovoot's internal operations role) does not have unrestricted personal-data access by
  default.
- Any OPS access to tenant or end-customer personal data must have a legitimate
  operational/support reason — it must be purpose-justified, not general browsing.
- OPS access to personal data must be auditable (see §12, Audit Logging) — the platform must
  be able to show why and when OPS accessed personal data.
- The precise mechanism for enforcing or recording this (e.g. support-case-gated access) is a
  technical/implementation decision for later; this section establishes the product principle
  only.

## 7. DATA RETENTION

- Retention is governed by **platform-defined retention defaults**, not by individual capability
  or tenant choice.
- Retention is **not tenant-configurable in V1** — tenants cannot set their own custom
  retention periods.
- Exact retention periods remain undecided in this document. They will be defined as explicit
  platform-wide defaults at a later stage, once decided.
- Until specific retention periods are defined, capabilities must not assume indefinite
  retention is acceptable by default, and should flag retention as an open item in their own
  PRDs.

## 8. DATA DELETION

- **Tenant/business data deletion requests are supported** — a tenant may request deletion of
  their account and associated data (e.g. on offboarding).
- **Individual lead deletion is supported** — a tenant (or, per §10, an end customer via a
  privacy request) may request deletion of a specific lead/submission record, not only
  full-account deletion.
- **Permanent deletion follows applicable retention/legal requirements** — deletion requests
  are honored, but permanent erasure is carried out consistent with whatever retention
  obligations (§7) or legal requirements apply at the time, rather than being instantaneous or
  unconditional in all cases.
- For V1, deletion is **request-based**, not self-service. Innovoot must have a defined (even
  if manual, non-automated) process to fulfill such requests.

## 9. CONSENT / PRIVACY NOTICE

- A consent/notice requirement is **required where applicable** for any capability that
  collects personal data from a public/end customer (e.g. a statement that submitted
  information will be used to contact the individual).
- Product's role here is to define the **capability** to present such a notice at the point of
  collection. This document does not invent or specify the legal wording of that notice — exact
  copy and legal sufficiency is a legal-review item (§19).
- Consent/notice requirements apply per-capability and must be addressed explicitly in each
  capability's PRD (e.g. Forms).

## 10. END-CUSTOMER PRIVACY REQUESTS

- End-customer privacy requests (e.g. "what data do you have on me," "delete my data," "stop
  contacting me") are **supported as a platform process**.
- For V1, this process is **request-based/manual**, not a self-service privacy portal. Innovoot
  must be able to receive, identify, and act on such a request even without dedicated
  in-product tooling.
- Per the working controller/processor model (§3), routing of such requests (to Innovoot
  directly, or to the relevant tenant) should follow that model, but the operational workflow
  itself is not designed in this document.

## 11. DATA EXPORT

- Data export (tenant self-service export of their own data, and/or end-customer export of
  their own submitted data) is **required as a future platform capability**.
- Data export is **explicitly out of scope for Forms V1**. It is noted here as a principle to
  design toward later, not as a current requirement.

## 12. AUDIT LOGGING

- Audit logging is **required as a platform capability from the beginning** — this is not
  deferred.
- Auditability specifically applies to: personal-data access, personal-data changes,
  personal-data deletion, administrative actions, permission/access changes, and important
  configuration changes.
- This requirement **does not require an audit UI in every V1 module**. The underlying
  capability to capture and attribute these events is the platform requirement; whether and how
  audit information is surfaced to tenants or OPS in a UI is a separate, later product decision.
- Each capability's PRD should consider whether and how its data-mutating actions are
  captured, consistent with this principle, without assuming a specific technical mechanism.

## 13. SECURITY BASELINE

- A **minimum platform security baseline** is required for any capability handling personal
  data.
- This document establishes that a baseline must exist as a product commitment, but does
  **not** specify detailed technical security mechanisms (encryption standards, infrastructure
  choices, specific controls). Those are implementation decisions for technical architecture,
  to be made consistent with this principle.

## 14. SUB-PROCESSORS

- Innovoot requires **platform-level tracking/management of third-party services** that
  process personal data on its behalf (e.g. services used for email delivery, file storage,
  payments, SMS/communications).
- This document does not decide the actual providers used, or the specific mechanism/format
  for tracking or disclosing them — only that this tracking capability is a platform
  requirement, to be formalized later (see §19).

## 15. CHILDREN'S DATA

- Children's data is **recognized as a platform concern**, not resolved in detail here.
- **No special children's-data functionality is required for Forms V1** — Forms V1's data
  scope (ordinary adult business/contact data) does not require age-gating or
  parental-consent handling at this stage.
- Any future capability that intentionally handles children's data (e.g. Healthcare pediatric
  contexts, or Hospitality bookings involving children) must explicitly address applicable
  children's-data requirements in its own PRD before launch. This is explicitly deferred for
  Healthcare (§18).

## 16. SENSITIVE DATA

- The platform distinguishes **ordinary personal/contact data** from **sensitive/special-category
  data**. Health/medical information is the first identified instance of the sensitive
  category.
- Every capability that collects personal data must, in its own PRD, explicitly declare
  whether its data falls into the ordinary category or the sensitive/special category.
- Capabilities handling sensitive/special-category data are expected to require additional
  product and technical safeguards beyond this document's baseline; those safeguards are
  defined at the point a sensitive-data capability is planned (e.g. Healthcare), not here.

## 17. FORMS V1 DATA BOUNDARY

- Forms V1 is **limited to ordinary contact/lead information only** — e.g. name, email, phone,
  and message-type fields.
- Forms V1 **must not intentionally collect or process medical/health information**, or any
  other data falling into the sensitive/special-category (§16).
- This boundary is a product design constraint on Forms V1's field configuration, not merely a
  policy statement — form field types and configuration in the Forms PRD must be consistent
  with this boundary.
- Forms V1 must still comply with all applicable sections of this document (isolation, access,
  retention posture, deletion, consent notice, audit requirement, security baseline).

## 18. HEALTHCARE DATA — DEFERRED TO HEALTHCARE PRD

- Healthcare will introduce sensitive/special-category data (e.g. patient registry information,
  prescriptions, consultation notes, per legacy evidence).
- The specific requirements for collecting, accessing, retaining, and protecting this data are
  **not defined in this document** and are explicitly deferred to the Healthcare Appointment
  PRD process.
- The Healthcare PRD must explicitly address: sensitive-data classification (§16),
  children's-data handling for pediatric contexts (§15), and any additional access, retention,
  or consent requirements beyond this document's baseline.

## 19. LEGAL REVIEW / OPEN AREAS

The following remain explicitly open, and require legal and/or further product review before
they can be treated as final commitments:

- Formal legal review/characterization of the controller/processor working product architecture
  assumption (§3).
- Definition of exact platform-wide retention periods (§7).
- Legal sufficiency and exact wording of any consent/privacy notice (§9).
- Formal workflow and SLA for end-customer privacy requests (§10) and data deletion (§8),
  including exactly how "applicable retention/legal requirements" (§8) are determined.
- Formal mechanism/format for sub-processor tracking, and any related disclosure or
  notification obligations (§14).
- Children's-data position for verticals beyond Forms V1, particularly Healthcare (§15, §18).
- Any jurisdiction-specific compliance obligations (e.g. GDPR, DPDP, HIPAA or equivalent) —
  not assessed or claimed anywhere in this document.
- Formal technical security architecture, to be defined consistent with §13's baseline
  principle.

---

### CONFIRMED DECISIONS

- Tenant data isolation is a hard, non-negotiable platform requirement (§4).
- Working controller/processor model, as a product architecture assumption subject to legal
  review, not a final legal characterization (§3).
- OPS has no unrestricted personal-data access by default; access requires a legitimate
  operational/support reason and must be auditable (§6).
- Tenant/business data deletion and individual lead deletion are both supported; permanent
  deletion follows applicable retention/legal requirements (§8).
- Retention uses platform-defined defaults, not tenant-configurable in V1; exact periods remain
  undecided (§7).
- Consent/notice is required where applicable for public data collection; legal wording is not
  defined here (§9).
- Data export is required as a future platform capability; explicitly out of scope for Forms V1
  (§11).
- End-customer privacy requests are supported as a platform process, initially
  request-based/manual (§10).
- Audit logging is required as a platform capability from the beginning, covering personal-data
  access/changes/deletion, administrative actions, permission/access changes, and important
  configuration changes — without requiring an audit UI in every V1 module (§12).
- Platform-level tracking/management of sub-processors is required; specific providers are not
  decided here (§14).
- A minimum platform security baseline is required; technical mechanisms are not specified here
  (§13).
- Children's data is a recognized platform concern; no special functionality is required for
  Forms V1; future capabilities intentionally handling children's data must address it in their
  own PRDs (§15).
- The platform distinguishes ordinary personal/contact data from sensitive/special-category
  data; Forms V1 is limited to ordinary contact/lead information; Healthcare-specific
  sensitive-data requirements are deferred to the Healthcare Appointment PRD (§16, §17, §18).

### DEFERRED DECISIONS

- Exact platform-wide retention periods (§7).
- Automated/self-service data deletion tooling and SLAs (§8).
- Self-service data export tooling, for tenants or end customers (§11).
- Audit log surfacing (UI/reporting) to tenants or OPS (§12).
- Specific mechanism/format for sub-processor tracking and any tenant notification process
  (§14).
- Children's-data handling mechanism for Healthcare and any vertical involving minors (§15,
  §18).
- All Healthcare-specific sensitive-data requirements (§18) — deferred to the Healthcare
  Appointment PRD.

### LEGAL / POLICY REVIEW REQUIRED

- Legal review/characterization of the controller/processor working product architecture
  assumption (§3).
- Legal sufficiency of consent/notice language once drafted (§9).
- Formal privacy-request and deletion workflow/SLA, including how retention/legal requirements
  determine permanent deletion timing, once designed (§8, §10).
- Sub-processor disclosure obligations, once a tracking mechanism is formalized (§14).
- Jurisdiction-specific compliance assessment (not performed in this document).
- Any customer-facing legal Privacy Policy derived from this document must be independently
  authored and reviewed by legal counsel — this document does not substitute for one.
