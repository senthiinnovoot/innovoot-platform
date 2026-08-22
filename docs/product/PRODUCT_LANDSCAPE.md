# Innovoot — Product Landscape

**Status:** APPROVED
**Scope:** Product landscape only — no PRD, no database design, no API design, no implementation code.

---

## CONFIRMED BUSINESS DIRECTION

The following decisions are confirmed stakeholder input and are the authoritative basis for this document:

1. Innovoot is a **multi-vertical product platform**, serving SMB and enterprise clients across multiple business categories.
2. The product model is **Common Platform Capabilities + Vertical-Specific Modules** — not a single-vertical product, and not a generic ERP.
3. The initial strategic verticals are **Healthcare** and **Hospitality**.
4. Other verticals (e.g. packers & movers, mehndi artists, schools) are **deferred** and are not part of current planning.
5. **Admin, OPS, and Widget** are the three planned product experiences.
6. **Forms / Lead Capture** is the first capability to take through the full PRD process.
7. **Healthcare Appointment — complete end-to-end flow** is the second major capability to plan, after Forms.
8. **Booking/Appointments** should ultimately be a reusable platform capability, with vertical-specific behavior layered on top. It is not to be designed yet.
9. **Chat** and **Billing** remain outside current confirmed scope until explicitly decided.
10. Legacy Admin and InnoForms remain **reference/evidence only** — they do not define the new product.

No product decisions beyond the above are asserted as confirmed in this document. Anything not listed here is either legacy evidence (clearly labeled) or an open question (listed at the end).

---

## PRODUCT LANDSCAPE

Innovoot is structured as:

```
COMMON PLATFORM CAPABILITIES
        +
VERTICAL-SPECIFIC MODULES
        +
INTERNAL OPS CAPABILITIES
```

delivered through three experiences — **Admin**, **OPS**, and **Widget** — for two initial verticals — **Healthcare** and **Hospitality** — with all other verticals deferred.

The platform's 6–12 month priority is to prove **one complete end-to-end business customer management tool**, not a broad set of disconnected modules. The first two capabilities selected for this proof are Forms/Lead Capture and the Healthcare Appointment end-to-end flow, in that order.

---

## CORE PLATFORM CAPABILITIES

Capabilities intended to be shared across verticals — usable by a Healthcare tenant, a Hospitality tenant, or (in the future) any other vertical.

| Capability                                 | Notes                                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Identity & Multi-Tenant Account Management | Foundational; every other capability depends on it                                                         |
| Branding / Shared Design System            | Enables a consistent, tenant-customizable digital presence                                                 |
| Public Widget / SDK Runtime                | The delivery mechanism for embeddable capabilities on tenant websites                                      |
| Forms & Lead Capture                       | First capability entering the PRD process                                                                  |
| Booking / Appointments                     | To become a reusable capability with vertical-specific behavior layered on top; **not to be designed yet** |
| Website / Digital Presence                 | Named in business vision; no current PRD priority set                                                      |
| Digital Marketing                          | Named in business vision; no current PRD priority set                                                      |
| Google Business Profile Management         | Named in business vision; no current PRD priority set                                                      |
| Review Management                          | Named in business vision; no current PRD priority set                                                      |
| Competitor Analysis                        | Named in business vision; no current PRD priority set                                                      |
| Analytics / Insights                       | Named in business vision; scope (tenant, OPS, or widget-level) not yet decided                             |

---

## HEALTHCARE MODULES

Vertical-specific modules for the Healthcare vertical, built on top of Core Platform Capabilities.

| Module area                                        | Notes                                                                                                       |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Appointment scheduling (hospital/clinic scenarios) | Target of the second PRD; to be planned as a vertical layer on the reusable Booking/Appointments capability |
| Patient registry, token & queue management         | Includes Medical Representative (MR) queue flows                                                            |
| Prescriptions & consultation notes                 | Vertical-specific clinical record-keeping                                                                   |
| Labs / pharmacies / medical businesses             | Named as in-scope sub-categories of the Healthcare vertical; not yet planned in detail                      |

---

## HOSPITALITY MODULES

Vertical-specific modules for the Hospitality vertical, built on top of Core Platform Capabilities.

| Module area                                                 | Notes                                                                                   |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Room / property booking                                     | To be planned as a vertical layer on the reusable Booking/Appointments capability       |
| Hotels, resorts, lodges, individual accommodation providers | Named as in-scope sub-categories of the Hospitality vertical; not yet planned in detail |

---

## FUTURE / DEFERRED VERTICALS

Explicitly out of current planning scope:

- Packers & movers
- Mehndi artists
- Schools
- Other service categories not yet named

These may become vertical modules in the future but should not influence current capability design.

---

## ADMIN / OPS / WIDGET EXPERIENCE

The three confirmed product experiences:

| Experience | Audience                                             | Purpose                                                                                |
| ---------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Admin**  | Business/tenant administrators and operational staff | Configure and manage the tenant's business (both Healthcare and Hospitality tenants)   |
| **OPS**    | Innovoot internal users                              | Manage tenant accounts, platform-wide configuration, and support across all verticals  |
| **Widget** | Public/end customers                                 | Embedded, public-facing experiences (booking, forms, etc.) surfaced on tenant websites |

Core Platform Capabilities are expected to have a presence across multiple experiences (e.g. Forms is configured in Admin and consumed via Widget); vertical modules extend those same experiences with vertical-specific behavior.

---

## LEGACY EVIDENCE / LESSONS

Legacy Admin and InnoForms are reference material only — they do not define scope, but they inform what has already been attempted and what to watch for.

- **Healthcare has the deepest legacy evidence** (appointments, doctors, locations, token/MR queues, prescriptions, notes) — useful reference for the second PRD, not a specification.
- **Hospitality has thin legacy evidence** (basic room/booking endpoints only) — most hospitality scope is net-new.
- **Website/Digital Presence, Digital Marketing, Google Business Profile, Review Management, and Competitor Analysis have no legacy evidence** — these are net-new capabilities for Innovoot, not gaps in old documentation.
- **Booking/queue ownership duplication is a documented legacy risk**: the legacy system had two components (`HCQueueControl` and `HCVisitsTimeline`/`MRQueueDrawer`) independently mutating the same queue data, requiring a dedicated observation effort to determine which was safe to retire. This is a caution for designing Booking/Appointments as a reusable capability — single, clear ownership should be established from the start rather than allowed to drift.
- **Legacy's data model is vertical-specific by construction** (`hospital_id`, doctor/location structure) and should not be assumed as the base shape for a generalized Booking/Appointments capability.
- **Chat and Billing had shallow or conflated legacy evidence** (Chat: minimal endpoints vs. described ambition; Billing: tenant-SaaS billing and customer payment collection were conflated under one label) — consistent with their current status as outside confirmed scope.

---

## OPEN PRODUCT DECISIONS

Not yet confirmed; not assumed anywhere in this document:

1. Whether Booking/Appointments will be generalized before or after the Healthcare Appointment PRD is completed.
2. Where Chat and Billing ultimately belong (Core, vertical-specific, or excluded) — deferred until explicitly decided.
3. What scope, if any, Hospitality receives during the current planning cycle versus being fully parked until Healthcare's end-to-end flow is proven.
4. Sequencing/timing details beyond the confirmed order (Forms first, Healthcare Appointment second).

---

_This document reflects confirmed business direction only. It does not define database tables, API contracts, or implementation details. The next step is to begin the PRD process for Forms / Lead Capture._
