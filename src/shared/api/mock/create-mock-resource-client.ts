import { ApiError, type PaginatedResponse, type QueryParams, type ResourceClient } from '../types'

const DEFAULT_LATENCY_MS = 300
const DEFAULT_PAGE_SIZE = 20

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0
  if (a === undefined || a === null) return 1
  if (b === undefined || b === null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

function sortRecords<T>(records: T[], sortBy?: string, direction: 'asc' | 'desc' = 'asc'): T[] {
  if (!sortBy) return records
  const sorted = [...records].sort((a, b) =>
    compareValues((a as Record<string, unknown>)[sortBy], (b as Record<string, unknown>)[sortBy]),
  )
  return direction === 'desc' ? sorted.reverse() : sorted
}

function notFound(id: string): ApiError {
  return new ApiError(`Resource with id "${id}" not found`, { status: 404, code: 'NOT_FOUND' })
}

export interface MockResourceClientConfig<T> {
  data: T[]
  /** Artificial latency in ms, so the UI can be built against real async behavior. Default 300. */
  latencyMs?: number
}

/**
 * Generic in-memory CRUD/pagination engine — no knowledge of what `T` is.
 * Deliberately simple: no persistence beyond the process lifetime, no
 * free-text search (that needs per-entity field knowledge this layer
 * shouldn't have), no random failure injection (would make dev flaky for
 * no benefit). See ADR-010 for why this exists and how it's replaced.
 */
export function createMockResourceClient<
  T extends { id: string },
  TCreateInput = Partial<T>,
  TUpdateInput = Partial<T>,
>(config: MockResourceClientConfig<T>): ResourceClient<T, TCreateInput, TUpdateInput> {
  let records: T[] = [...config.data]
  const latency = config.latencyMs ?? DEFAULT_LATENCY_MS
  let nextId = records.length + 1

  function generateId(): string {
    const id = `mock-${nextId}`
    nextId += 1
    return id
  }

  return {
    async list(params?: QueryParams): Promise<PaginatedResponse<T>> {
      await delay(latency)
      const sorted = sortRecords(records, params?.sortBy, params?.sortDirection)
      const page = params?.page ?? 1
      const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE
      const start = (page - 1) * pageSize
      return {
        data: sorted.slice(start, start + pageSize),
        total: sorted.length,
        page,
        pageSize,
      }
    },

    async get(id: string): Promise<T> {
      await delay(latency)
      const record = records.find((r) => r.id === id)
      if (!record) throw notFound(id)
      return record
    },

    async create(input: TCreateInput): Promise<T> {
      await delay(latency)
      // The cast is intentional: this generic engine can't structurally
      // verify TCreateInput produces a valid T — a real backend enforces
      // that at insert time; runtime validation of business shapes is a
      // module concern (zod), out of scope for this proof-of-architecture.
      const record = { ...input, id: generateId() } as unknown as T
      records = [...records, record]
      return record
    },

    async update(id: string, input: TUpdateInput): Promise<T> {
      await delay(latency)
      const index = records.findIndex((r) => r.id === id)
      if (index === -1) throw notFound(id)
      const updated = { ...records[index], ...input } as T
      records = [...records.slice(0, index), updated, ...records.slice(index + 1)]
      return updated
    },

    async remove(id: string): Promise<void> {
      await delay(latency)
      const index = records.findIndex((r) => r.id === id)
      if (index === -1) throw notFound(id)
      records = records.filter((r) => r.id !== id)
    },
  }
}
