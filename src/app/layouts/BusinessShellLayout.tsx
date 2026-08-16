import { Outlet } from 'react-router-dom'

import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/**
 * The module-aware application shell for a business/branch context —
 * mounted under `/b/:businessId/branch/:branchId`. Sidebar/TopBar are
 * app-level composition of already-built `components/ui` and
 * `components/feedback` primitives, not new generic design-system
 * components — that's Phase 3C's `SidebarShell`/`TopBarShell`, not built
 * here (see the architecture-reconciliation discussion).
 */
export function BusinessShellLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
