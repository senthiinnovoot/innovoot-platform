import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { useBusinessContext, useIsModuleEnabled } from './useBusinessContext'

function createWrapper(initialPath = '/b/business-1/branch/branch-1/dashboard') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/b/:businessId/branch/:branchId/dashboard" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}

describe('useBusinessContext', () => {
  it('resolves the business context using businessId/branchId from the URL', async () => {
    const { result } = renderHook(() => useBusinessContext(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 })
    expect(result.current.data?.business.name).toBe('ABC City Hospital')
    expect(result.current.data?.branch.name).toBe('Main Branch')
    expect(result.current.data?.businessType.name).toBe('Hospital')
  })
})

function useTestHarness() {
  const context = useBusinessContext()
  const patientsEnabled = useIsModuleEnabled('patients')
  const billingEnabled = useIsModuleEnabled('billing')
  return { context, patientsEnabled, billingEnabled }
}

describe('useIsModuleEnabled', () => {
  it('is true for a module the current business type enables', async () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.context.isSuccess).toBe(true), { timeout: 3000 })
    expect(result.current.patientsEnabled).toBe(true)
  })

  it('is false for a module the current business type does not enable', async () => {
    const { result } = renderHook(() => useTestHarness(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.context.isSuccess).toBe(true), { timeout: 3000 })
    expect(result.current.billingEnabled).toBe(false)
  })
})
