import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { useCustomers } from './useCustomers'

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useCustomers', () => {
  it('starts in a loading state', () => {
    const { result } = renderHook(() => useCustomers({ pageSize: 5 }), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('fetches a paginated list of customers via TanStack Query', async () => {
    const { result } = renderHook(() => useCustomers({ pageSize: 5 }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.data.length).toBeLessThanOrEqual(5)
    expect(result.current.data?.total).toBeGreaterThan(0)
  })

  it('returns sorted data when sort params are provided', async () => {
    const { result } = renderHook(
      () => useCustomers({ pageSize: 100, sortBy: 'name', sortDirection: 'asc' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const names = result.current.data?.data.map((customer) => customer.name) ?? []
    const expected = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(expected)
  })

  it('re-fetches under a different query key when params change', async () => {
    const { result, rerender } = renderHook(
      ({ params }: { params: { page: number; pageSize: number } }) => useCustomers(params),
      { wrapper: createWrapper(), initialProps: { params: { page: 1, pageSize: 5 } } },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const firstPageIds = result.current.data?.data.map((customer) => customer.id)

    rerender({ params: { page: 2, pageSize: 5 } })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const secondPageIds = result.current.data?.data.map((customer) => customer.id)

    expect(secondPageIds).not.toEqual(firstPageIds)
  })
})
