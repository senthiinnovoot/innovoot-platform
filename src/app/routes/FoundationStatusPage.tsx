/**
 * Temporary root route.
 *
 * This exists only to prove the app shell (providers, layout, router,
 * Tailwind, path aliases) wires together end to end. It must be replaced
 * by the real landing route (likely `modules/dashboard`) once business
 * modules begin, per docs/architecture/overview.md — do not build on top
 * of this page. Now also styled with real design-system tokens rather
 * than raw Tailwind slate/gray classes, to dogfood the Phase 2 tokens.
 */
export function FoundationStatusPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16">
      <p className="text-label text-muted-foreground uppercase">Innovoot</p>
      <h1 className="text-display-sm text-foreground font-semibold">
        Architecture foundation ready
      </h1>
      <p className="text-body-md text-muted-foreground">
        Phase 1 (project understanding, architecture, folder structure, and development standards)
        and Phase 2 (design system foundation) are scaffolded. No business modules have been built
        yet — see <code className="text-caption bg-muted rounded px-1.5 py-0.5">CLAUDE.md</code> and{' '}
        <code className="text-caption bg-muted rounded px-1.5 py-0.5">docs/</code> for the agreed
        conventions before starting Phase 3.
      </p>
      {import.meta.env.DEV && (
        <a
          href="/design-system"
          className="text-body-sm text-primary font-medium underline underline-offset-4 hover:no-underline"
        >
          View the design-system showcase →
        </a>
      )}
    </main>
  )
}
