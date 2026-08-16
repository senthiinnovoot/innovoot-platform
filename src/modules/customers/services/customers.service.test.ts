import { describe, expect, it } from 'vitest'

import { customersService } from './customers.service'

describe('customersService', () => {
  it('lists customers with pagination', async () => {
    const result = await customersService.getCustomers({ page: 1, pageSize: 10 })
    expect(result.data.length).toBeLessThanOrEqual(10)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
    // enough seed records to prove real pagination, not just returning everything
    expect(result.total).toBeGreaterThan(10)
  })

  it('returns a second page with different records', async () => {
    const firstPage = await customersService.getCustomers({ page: 1, pageSize: 10 })
    const secondPage = await customersService.getCustomers({ page: 2, pageSize: 10 })
    const firstIds = firstPage.data.map((customer) => customer.id)
    const secondIds = secondPage.data.map((customer) => customer.id)
    expect(secondIds).not.toEqual(firstIds)
  })

  it('sorts customers by name ascending', async () => {
    const result = await customersService.getCustomers({
      pageSize: 100,
      sortBy: 'name',
      sortDirection: 'asc',
    })
    const names = result.data.map((customer) => customer.name)
    const expected = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(expected)
  })

  it('gets a single customer by id', async () => {
    const list = await customersService.getCustomers({ pageSize: 1 })
    const target = list.data[0]
    const customer = await customersService.getCustomer(target.id)
    expect(customer.id).toBe(target.id)
    expect(customer.email).toBe(target.email)
  })

  it('rejects when getting a non-existent customer', async () => {
    await expect(customersService.getCustomer('does-not-exist')).rejects.toThrow()
  })

  it('creates a customer', async () => {
    const created = await customersService.createCustomer({
      name: 'Test Customer',
      email: 'test.customer@example.com',
      phone: '555-0199',
      status: 'active',
    })
    expect(created.id).toBeTruthy()
    expect(created.name).toBe('Test Customer')
    expect(created.status).toBe('active')
  })

  it('updates a customer', async () => {
    const list = await customersService.getCustomers({ pageSize: 1 })
    const target = list.data[0]
    const updated = await customersService.updateCustomer(target.id, { status: 'inactive' })
    expect(updated.id).toBe(target.id)
    expect(updated.status).toBe('inactive')
    expect(updated.email).toBe(target.email)
  })

  it('deletes a customer', async () => {
    const created = await customersService.createCustomer({
      name: 'To Delete',
      email: 'to.delete@example.com',
      phone: '555-0198',
      status: 'active',
    })
    await customersService.deleteCustomer(created.id)
    await expect(customersService.getCustomer(created.id)).rejects.toThrow()
  })
})
