/**
 * Minimal, illustrative shape used only to prove the mock/real API
 * architecture (ADR-010) — not the final Innovoot customer schema. Expect
 * this to change once real business requirements for this module exist.
 */
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  createdAt: string
}

export type CreateCustomerInput = Omit<Customer, 'id' | 'createdAt'>
export type UpdateCustomerInput = Partial<CreateCustomerInput>
