import { describe, expect, it } from 'vitest'

import { businessContextService } from './business-context.service'

describe('businessContextService', () => {
  it('resolves the full business context for the Hospital sample', async () => {
    const context = await businessContextService.getBusinessContext('business-1', 'branch-1')

    expect(context.tenant.name).toBe('ABC Healthcare Group')
    expect(context.business.name).toBe('ABC City Hospital')
    expect(context.branch.name).toBe('Main Branch')
    expect(context.businessType.name).toBe('Hospital')
  })

  it('resolves the Hospital business type with exactly the enabled modules, no more', async () => {
    const context = await businessContextService.getBusinessContext('business-1', 'branch-1')
    const keys = context.businessType.modules.map((module) => module.key)

    expect(keys).toEqual(['patients', 'appointments', 'pharmacy', 'lab', 'rooms'])
  })

  it('does not invent extra modules beyond what the business type configuration lists', async () => {
    const context = await businessContextService.getBusinessContext('business-1', 'branch-1')
    expect(context.businessType.modules).toHaveLength(5)
  })

  it('gets a single business by id', async () => {
    const business = await businessContextService.getBusiness('business-1')
    expect(business.name).toBe('ABC City Hospital')
  })

  it('gets a single branch by id', async () => {
    const branch = await businessContextService.getBranch('branch-1')
    expect(branch.name).toBe('Main Branch')
  })

  it('rejects when the business id does not exist', async () => {
    await expect(
      businessContextService.getBusinessContext('does-not-exist', 'branch-1'),
    ).rejects.toThrow()
  })

  it('rejects when the branch id does not exist', async () => {
    await expect(
      businessContextService.getBusinessContext('business-1', 'does-not-exist'),
    ).rejects.toThrow()
  })
})
