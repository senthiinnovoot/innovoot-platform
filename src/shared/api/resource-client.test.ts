import { describe, expect, it } from 'vitest'

import { createResourceClient } from './resource-client'

interface Item {
  id: string
  name: string
}

describe('createResourceClient', () => {
  it('returns a working ResourceClient backed by the mock implementation', async () => {
    const client = createResourceClient<Item>({
      data: [{ id: '1', name: 'Test' }],
      endpoint: '/items',
      latencyMs: 0,
    })
    const result = await client.list()
    expect(result.data).toHaveLength(1)
    expect(result.data[0].name).toBe('Test')
  })

  it('ignores the endpoint config today (reserved for the future HTTP implementation)', async () => {
    const client = createResourceClient<Item>({
      data: [{ id: '1', name: 'Test' }],
      endpoint: '/anything',
      latencyMs: 0,
    })
    // still resolves via the mock engine regardless of the endpoint value
    const item = await client.get('1')
    expect(item.name).toBe('Test')
  })
})
