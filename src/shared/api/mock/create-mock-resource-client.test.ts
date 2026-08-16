import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '../types'
import { createMockResourceClient } from './create-mock-resource-client'

interface Item {
  id: string
  name: string
  rank: number
}

function seed(): Item[] {
  return [
    { id: '1', name: 'Charlie', rank: 3 },
    { id: '2', name: 'Alpha', rank: 1 },
    { id: '3', name: 'Bravo', rank: 2 },
  ]
}

describe('createMockResourceClient', () => {
  it('lists all records with default pagination', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const result = await client.list()
    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(3)
    expect(result.page).toBe(1)
  })

  it('paginates results', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const page1 = await client.list({ page: 1, pageSize: 2 })
    expect(page1.data).toHaveLength(2)
    expect(page1.total).toBe(3)

    const page2 = await client.list({ page: 2, pageSize: 2 })
    expect(page2.data).toHaveLength(1)
  })

  it('sorts ascending by a field', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const result = await client.list({ sortBy: 'rank', sortDirection: 'asc' })
    expect(result.data.map((item) => item.name)).toEqual(['Alpha', 'Bravo', 'Charlie'])
  })

  it('sorts descending by a field', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const result = await client.list({ sortBy: 'rank', sortDirection: 'desc' })
    expect(result.data.map((item) => item.name)).toEqual(['Charlie', 'Bravo', 'Alpha'])
  })

  it('gets a record by id', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const item = await client.get('2')
    expect(item.name).toBe('Alpha')
  })

  it('throws an ApiError when getting a missing id', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    await expect(client.get('missing')).rejects.toBeInstanceOf(ApiError)
  })

  it('creates a record with a generated id', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const created = await client.create({ name: 'Delta', rank: 4 })
    expect(created.id).toBeTruthy()
    expect(created.name).toBe('Delta')

    const result = await client.list()
    expect(result.total).toBe(4)
  })

  it('updates an existing record, preserving untouched fields', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    const updated = await client.update('1', { name: 'Charlie Updated' })
    expect(updated.name).toBe('Charlie Updated')
    expect(updated.rank).toBe(3)
  })

  it('throws an ApiError when updating a missing id', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    await expect(client.update('missing', { name: 'X' })).rejects.toBeInstanceOf(ApiError)
  })

  it('removes a record', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    await client.remove('1')
    const result = await client.list()
    expect(result.total).toBe(2)
    expect(result.data.find((item) => item.id === '1')).toBeUndefined()
  })

  it('throws an ApiError when removing a missing id', async () => {
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 0 })
    await expect(client.remove('missing')).rejects.toBeInstanceOf(ApiError)
  })

  it('behaves asynchronously with configurable artificial latency', async () => {
    vi.useFakeTimers()
    const client = createMockResourceClient<Item>({ data: seed(), latencyMs: 1000 })
    let resolved = false
    void client.list().then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(500)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(500)
    expect(resolved).toBe(true)
    vi.useRealTimers()
  })
})
