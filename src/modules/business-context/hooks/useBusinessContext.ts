import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { businessContextService } from '../services/business-context.service'

/**
 * The URL is the source of truth for the current business/branch (approved
 * decision — see ADR-011 once written), so this hook reads directly from
 * route params rather than a separately-stored id. No competing source of
 * truth: nothing else tracks "which business/branch is current."
 */
export function useBusinessContext() {
  const { businessId, branchId } = useParams<{ businessId: string; branchId: string }>()

  return useQuery({
    queryKey: ['business-context', businessId, branchId],
    queryFn: () => businessContextService.getBusinessContext(businessId!, branchId!),
    enabled: Boolean(businessId && branchId),
  })
}

/** Convenience derived check — used by `RequireModule` and by navigation rendering. */
export function useIsModuleEnabled(moduleKey: string): boolean {
  const { data } = useBusinessContext()
  return data?.businessType.modules.some((candidate) => candidate.key === moduleKey) ?? false
}
