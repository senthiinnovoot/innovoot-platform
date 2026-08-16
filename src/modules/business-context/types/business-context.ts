import type { IconName } from '@design-system/icons'

export interface Tenant {
  id: string
  name: string
}

export interface BusinessCategory {
  id: string
  name: string
  slug: string
}

/** A module a business type can have enabled — e.g. "Patients", "Rooms". */
export interface Module {
  id: string
  /** Stable machine-readable key used for routing/guard checks — e.g. "patients". */
  key: string
  name: string
  icon: IconName
}

/** Resolved shape — `modules` is already the full list, not a join-table id array. */
export interface BusinessType {
  id: string
  categoryId: string
  name: string
  slug: string
  modules: Module[]
}

export interface Business {
  id: string
  tenantId: string
  businessTypeId: string
  name: string
}

export interface Branch {
  id: string
  businessId: string
  name: string
}

/** The resolved bundle `useBusinessContext()` returns for the current URL-scoped business/branch. */
export interface BusinessContext {
  tenant: Tenant
  business: Business
  branch: Branch
  businessType: BusinessType
}
