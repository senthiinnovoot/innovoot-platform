import { EmptyState } from '@components/feedback'

export interface ModulePlaceholderPageProps {
  moduleName: string
}

/**
 * One reused placeholder for every not-yet-built module route — not a
 * separate fake page per module. Proves navigation/routing/module-guard
 * behavior without building any real module's UI.
 */
export function ModulePlaceholderPage({ moduleName }: ModulePlaceholderPageProps) {
  return (
    <EmptyState
      title={`${moduleName} module`}
      description="This module's UI hasn't been built yet — this route exists to prove module-aware navigation."
    />
  )
}
