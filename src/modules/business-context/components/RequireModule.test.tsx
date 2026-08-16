import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { RequireModule } from './RequireModule'

function renderWithRoute(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/b/:businessId/branch/:branchId/dashboard"
            element={<div>Dashboard Page</div>}
          />
          <Route
            path="/b/:businessId/branch/:branchId/patients"
            element={
              <RequireModule moduleKey="patients">
                <div>Patients Page</div>
              </RequireModule>
            }
          />
          <Route
            path="/b/:businessId/branch/:branchId/billing"
            element={
              <RequireModule moduleKey="billing">
                <div>Billing Page</div>
              </RequireModule>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RequireModule', () => {
  it('renders the children when the module is enabled for the business type (Hospital → Patients)', async () => {
    renderWithRoute('/b/business-1/branch/branch-1/patients')
    // resolving the full business context chains through the mock client's
    // simulated latency more than once — default waitFor timeout is tight
    await waitFor(() => expect(screen.getByText('Patients Page')).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('redirects to the dashboard when the module is not enabled for the business type', async () => {
    renderWithRoute('/b/business-1/branch/branch-1/billing')
    await waitFor(() => expect(screen.getByText('Dashboard Page')).toBeInTheDocument(), {
      timeout: 3000,
    })
    expect(screen.queryByText('Billing Page')).not.toBeInTheDocument()
  })

  it('shows a loading state before the business context resolves', () => {
    renderWithRoute('/b/business-1/branch/branch-1/patients')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
