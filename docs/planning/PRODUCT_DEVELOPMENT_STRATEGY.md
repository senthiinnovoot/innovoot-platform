# Innovoot — Product Development Strategy

This document defines the approved strategic approach for the new Innovoot platform. It contains
only decisions that have already been explicitly established. Do not add new decisions to this
document without explicit approval.

## 1. Clean-Slate Development

Innovoot is being developed from scratch.

The existing Admin Dashboard and InnoForms systems are reference material only. This is not a
migration project.

Do not migrate or reproduce legacy:

- database schema
- API contracts
- backend architecture
- repository structure
- authentication
- component architecture

## 2. New Technical Foundation

The new Innovoot Base Kit is the frontend starting point.

The backend will be developed independently using a new PostgreSQL database and new API
architecture.

The new database and APIs must be derived from approved product requirements, not from the legacy
MySQL schema or APIs.

## 3. Legacy Systems

Legacy Admin Dashboard and InnoForms documentation may be used to understand:

- existing business capabilities
- user workflows
- customer problems
- useful lessons
- legacy technical/product mistakes

They are evidence, not specifications.

## 4. Feature-by-Feature Development

Innovoot will be developed one product capability at a time.

The standard lifecycle is:

```text
Problem
→ Users/Roles
→ User Journey
→ PRD
→ UX/IA
→ Data Requirements
→ API Requirements
→ Design System Requirements
→ Acceptance Criteria
→ Implementation Ready
→ Claude Code
→ Testing/Verification
```

No implementation should begin before the relevant PRD is approved and implementation-ready.

## 5. Three Product Experiences

The new platform will contain three distinct experiences:

- **Admin** — business/tenant users
- **OPS** — internal Innovoot operations
- **Widget** — public/end-customer experiences

They should be treated as separate application experiences within the same overall Innovoot
platform.

## 6. Shared Design System

Admin, OPS and Widget will use one Innovoot design system.

The system will provide shared:

- design tokens
- typography
- color
- spacing
- radius
- elevation
- icons
- components
- states
- accessibility rules
- responsive principles

Different applications may have different layouts and interaction patterns.

## 7. Responsibilities

**Claude Planning:**
Product strategy, product requirements, UX/IA, PRDs, data requirements, API requirements and
implementation handoff specifications.

**Backend Developer:**
PostgreSQL domain model, database schema, API architecture and backend implementation.

**Claude Code:**
Implementation of approved implementation-ready work, testing and verification. Claude Code must
not redefine product scope.

## 8. Core Principle

Product requirements come first.

The database, API and implementation should be derived from approved product requirements rather
than the other way around.

## 9. Explicitly Not Decided Yet

Do not treat the following as finalized:

- monorepo vs multi-repo
- backend service topology
- authentication architecture
- shared contracts/types strategy
- exact design-system implementation
- product/domain sequencing
- final feature scope
