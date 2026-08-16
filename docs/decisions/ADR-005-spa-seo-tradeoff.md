# ADR-005: SPA vs. SSR — the SEO module tradeoff

**Status:** Accepted, with a documented open risk

## Context

The project's module list includes `seo`, which strongly suggests server rendering (a
`Next.js`-style meta-framework renders meta tags, structured data, and content server-side,
which client-only SPAs cannot do without extra work). This was flagged explicitly as an
architectural conflict before the framework decision was finalized: recommended Next.js given
this signal, but the project owner chose React + Vite as a pure client-rendered SPA.

## Decision

Proceed with the SPA choice made in [ADR-002](./ADR-002-technology-stack.md). The `seo` module
will, when built, handle what an SPA _can_ reasonably do for search visibility:

- Client-side `<title>`/meta tag management per route (e.g. via `react-helmet-async` or the
  native React 19 document-metadata support).
- Structured data (JSON-LD) injection where relevant.
- A generated sitemap as a build step, if/when there are public routes worth indexing.

What it explicitly **cannot** do without further architectural change: serve fully-rendered HTML
to crawlers/link-unfurlers that don't execute JavaScript, or achieve the page-load/Core Web
Vitals characteristics of server-rendered pages.

## Consequences

- If public-facing SEO (marketing pages, public profiles, anything meant to rank in search or
  unfurl nicely when shared) becomes a near-term product priority, this decision should be
  revisited _before_ significant module code is built on top of the SPA assumption — migrating a
  populated SPA to a meta-framework later is a substantially larger project than choosing one at
  the start.
- If Innovoot turns out to be a purely authenticated, behind-login product (a plausible reading
  of a CRM-style module list — customers/leads/orders/payments are not typically public), this
  tradeoff may never matter in practice. Confirm this assumption with the product owner rather
  than assuming it.
