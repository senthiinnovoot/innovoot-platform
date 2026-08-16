import { createResourceClient, type QueryParams } from '@shared/api'

import customersData from '../mock-data/customers.json'
import type { Customer, CreateCustomerInput, UpdateCustomerInput } from '../types/customer'

/**
 * The only file in this module that touches `customers.json` directly.
 * Everything else — hooks, and eventually pages/components — calls
 * `customersService`, never the mock data or `ResourceClient` directly.
 */
const client = createResourceClient<Customer, CreateCustomerInput, UpdateCustomerInput>({
  data: customersData as Customer[],
  endpoint: '/customers',
})

export const customersService = {
  getCustomers: (params?: QueryParams) => client.list(params),
  getCustomer: (id: string) => client.get(id),
  createCustomer: (input: CreateCustomerInput) => client.create(input),
  updateCustomer: (id: string, input: UpdateCustomerInput) => client.update(id, input),
  deleteCustomer: (id: string) => client.remove(id),
}
