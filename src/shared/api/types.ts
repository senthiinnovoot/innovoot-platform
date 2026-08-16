/**
 * Thrown by any `ResourceClient` implementation (mock today, HTTP later)
 * on a failed operation — a real `status`/`code` so callers can branch on
 * failure kind the same way regardless of which implementation is behind
 * the client.
 */
export class ApiError extends Error {
  status?: number
  code?: string

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.code = options?.code
  }
}

export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * The contract every module's service is written against. Only a mock
 * implementation exists today (see `createResourceClient` in
 * `resource-client.ts`); a future HTTP-backed implementation satisfies
 * this same interface — see ADR-010.
 */
export interface ResourceClient<T, TCreateInput = Partial<T>, TUpdateInput = Partial<T>> {
  list(params?: QueryParams): Promise<PaginatedResponse<T>>
  get(id: string): Promise<T>
  create(input: TCreateInput): Promise<T>
  update(id: string, input: TUpdateInput): Promise<T>
  remove(id: string): Promise<void>
}
