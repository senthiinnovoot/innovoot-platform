import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { BusinessShellLayout } from '@app/layouts/BusinessShellLayout'
import { RootLayout } from '@app/layouts/RootLayout'
import { DashboardPage } from '@modules/dashboard'
import { RequireModule } from '@modules/business-context'

import { DesignSystemShowcasePage } from './DesignSystemShowcasePage'
import { FoundationStatusPage } from './FoundationStatusPage'
import { ModulePlaceholderPage } from './ModulePlaceholderPage'

/**
 * Root route tree.
 *
 * As business modules are built, each module owns its own route objects
 * (typically exported from `modules/<name>/index.ts`) and registers them
 * as children here. Do not define module page components in this file —
 * this file only assembles routes that other layers expose.
 *
 * Route registration stays static — module *availability* per business
 * type is a `RequireModule` guard check at render time, not a dynamically
 * constructed route tree. See docs/decisions (Phase 4A) for why.
 */
const rootChildren: RouteObject[] = [{ index: true, element: <FoundationStatusPage /> }]

// The module pages below don't exist yet (that's the next phase) — these
// are intentionally minimal placeholders proving navigation/routing/module
// guarding, not the modules themselves.
const businessRoutes: RouteObject[] = [
  { path: 'dashboard', element: <DashboardPage /> },
  {
    path: 'patients',
    element: (
      <RequireModule moduleKey="patients">
        <ModulePlaceholderPage moduleName="Patients" />
      </RequireModule>
    ),
  },
  {
    path: 'appointments',
    element: (
      <RequireModule moduleKey="appointments">
        <ModulePlaceholderPage moduleName="Appointments" />
      </RequireModule>
    ),
  },
  {
    path: 'pharmacy',
    element: (
      <RequireModule moduleKey="pharmacy">
        <ModulePlaceholderPage moduleName="Pharmacy" />
      </RequireModule>
    ),
  },
  {
    path: 'lab',
    element: (
      <RequireModule moduleKey="lab">
        <ModulePlaceholderPage moduleName="Lab" />
      </RequireModule>
    ),
  },
  {
    path: 'rooms',
    element: (
      <RequireModule moduleKey="rooms">
        <ModulePlaceholderPage moduleName="Rooms" />
      </RequireModule>
    ),
  },
]

rootChildren.push({
  path: 'b/:businessId/branch/:branchId',
  element: <BusinessShellLayout />,
  children: businessRoutes,
})

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
