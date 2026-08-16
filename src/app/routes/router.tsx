import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { RootLayout } from '@app/layouts/RootLayout'

import { DesignSystemShowcasePage } from './DesignSystemShowcasePage'
import { FoundationStatusPage } from './FoundationStatusPage'

/**
 * Root route tree.
 *
 * As business modules are built, each module owns its own route objects
 * (typically exported from `modules/<name>/index.ts`) and registers them
 * as children here. Do not define module page components in this file —
 * this file only assembles routes that other layers expose.
 */
const rootChildren: RouteObject[] = [{ index: true, element: <FoundationStatusPage /> }]

// The design-system showcase is a development aid, not a product page —
// don't ship its route in production builds. `import.meta.env.DEV` is
// statically replaced by Vite, so this branch (and the page's code) is
// stripped from the production bundle entirely, not just hidden at runtime.
if (import.meta.env.DEV) {
  rootChildren.push({ path: 'design-system', element: <DesignSystemShowcasePage /> })
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: rootChildren,
  },
])
