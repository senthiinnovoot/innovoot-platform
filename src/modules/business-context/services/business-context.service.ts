import { createResourceClient } from '@shared/api'

import type { IconName } from '@design-system/icons'

import mockData from '../mock-data/business-context.json'
import type {
  Branch,
  Business,
  BusinessContext,
  BusinessType,
  Module,
  Tenant,
} from '../types/business-context'

/** Raw module catalog record from mock data — no icon yet (a real backend wouldn't return one). */
interface ModuleRecord {
  id: string
  key: string
  name: string
}

/** Raw business-type record from mock data — `moduleKeys` is the join-table-shaped id list. */
interface BusinessTypeRecord {
  id: string
  categoryId: string
  name: string
  slug: string
  moduleKeys: string[]
}

const moduleIconByKey: Record<string, IconName> = {
  patients: 'users',
  appointments: 'calendar',
  pharmacy: 'pill',
  lab: 'flask-conical',
  rooms: 'bed',
}

const modulesClient = createResourceClient<ModuleRecord>({
  data: mockData.modules,
  endpoint: '/modules',
})
const businessTypesClient = createResourceClient<BusinessTypeRecord>({
  data: mockData.businessTypes,
  endpoint: '/business-types',
})
const businessesClient = createResourceClient<Business>({
  data: mockData.businesses,
  endpoint: '/businesses',
})
const branchesClient = createResourceClient<Branch>({
  data: mockData.branches,
  endpoint: '/branches',
})

/** The frontend only ever needs the resolved `modules: Module[]` shape — never the raw join keys. */
async function resolveBusinessType(businessTypeId: string): Promise<BusinessType> {
  // The business-type record and the module catalog don't depend on each
  // other — fetch in parallel rather than chaining two round-trips through
  // the mock client's simulated latency.
  const [record, allModules] = await Promise.all([
    businessTypesClient.get(businessTypeId),
    modulesClient.list({ pageSize: mockData.modules.length }),
  ])
  const modules: Module[] = record.moduleKeys
    .map((key) => allModules.data.find((candidate) => candidate.key === key))
    .filter((candidate): candidate is ModuleRecord => candidate !== undefined)
    .map((candidate) => ({
      id: candidate.id,
      key: candidate.key,
      name: candidate.name,
      icon: moduleIconByKey[candidate.key] ?? 'layout-dashboard',
    }))

  return {
    id: record.id,
    categoryId: record.categoryId,
    name: record.name,
    slug: record.slug,
    modules,
  }
}

async function getTenant(): Promise<Tenant> {
  // Single-tenant mock today — still async so swapping to a real HTTP call
  // later doesn't change any caller's code, per ADR-010.
  return Promise.resolve(mockData.tenant)
}

export const businessContextService = {
  getTenant,
  getBusiness: (businessId: string) => businessesClient.get(businessId),
  getBranch: (branchId: string) => branchesClient.get(branchId),
  getBusinessType: resolveBusinessType,

  /** The single call `useBusinessContext()` makes — resolves everything the shell needs at once. */
  async getBusinessContext(businessId: string, branchId: string): Promise<BusinessContext> {
    const [tenant, business, branch] = await Promise.all([
      getTenant(),
      businessesClient.get(businessId),
      branchesClient.get(branchId),
    ])
    const businessType = await resolveBusinessType(business.businessTypeId)
    return { tenant, business, branch, businessType }
  },
}
