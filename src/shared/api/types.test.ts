import { describe, expect, it } from 'vitest'

import { ApiError } from './types'

describe('ApiError', () => {
  it('is a real Error with message, status, and code', () => {
    const error = new ApiError('Not found', { status: 404, code: 'NOT_FOUND' })
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Not found')
    expect(error.status).toBe(404)
    expect(error.code).toBe('NOT_FOUND')
    expect(error.name).toBe('ApiError')
  })

  it('allows omitting status and code', () => {
    const error = new ApiError('Something went wrong')
    expect(error.status).toBeUndefined()
    expect(error.code).toBeUndefined()
  })
})
