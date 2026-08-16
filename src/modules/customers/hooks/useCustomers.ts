import { useQuery } from '@tanstack/react-query'

import type { QueryParams } from '@shared/api'

import { customersService } from '../services/customers.service'

/**
 * The only sanctioned way for UI to read the customer list —
 * `useCustomers()` → TanStack Query → `customersService` → `ResourceClient`.
 * No component should import `customersService` or the mock data directly.
 */
export function useCustomers(params?: QueryParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersService.getCustomers(params),
  })
}
