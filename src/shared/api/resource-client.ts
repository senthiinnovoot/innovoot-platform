import { createMockResourceClient } from './mock/create-mock-resource-client'
import type { ResourceClient } from './types'

export interface CreateResourceClientConfig<T> {
  /** Mock seed data — the only source used right now (see ADR-010). */
  data: T[]
  /**
   * Reserved for the future HTTP-backed implementation (the REST path this
   * resource will live at, e.g. `/customers`). Unused by the mock
   * implementation today — kept on the config now so no module code needs
   * to change when a real implementation is wired in later.
   */
  endpoint: string
  /** Artificial latency for the mock implementation, in ms. */
  latencyMs?: number
}

/**
 * The single entry point every module's service should use to get a
 * `ResourceClient` — never construct a mock or HTTP client directly. Only
 * a mock implementation exists right now; see ADR-010 for how a future
 * HTTP-backed implementation slots in here without any module, hook, or
 * page code changing.
 */
export function createResourceClient<
  T extends { id: string },
  TCreateInput = Partial<T>,
  TUpdateInput = Partial<T>,
>(config: CreateResourceClientConfig<T>): ResourceClient<T, TCreateInput, TUpdateInput> {
  return createMockResourceClient<T, TCreateInput, TUpdateInput>(config)
}
