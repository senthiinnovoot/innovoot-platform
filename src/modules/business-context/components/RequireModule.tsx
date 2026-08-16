import type { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { LoadingState } from '@components/feedback'

import { useBusinessContext, useIsModuleEnabled } from '../hooks/useBusinessContext'

export interface RequireModuleProps {
  moduleKey: string
  children: ReactNode
}

/**
 * "If this business type does not have this module enabled, do not render
 * it." Module availability comes entirely from `useBusinessContext()` —
 * this component has no knowledge of what a module's page actually does.
 */
export function RequireModule({ moduleKey, children }: RequireModuleProps) {
  const { businessId, branchId } = useParams<{ businessId: string; branchId: string }>()
  const { isLoading } = useBusinessContext()
  const enabled = useIsModuleEnabled(moduleKey)

  if (isLoading) return <LoadingState label="Loading…" />
  if (!enabled) return <Navigate to={`/b/${businessId}/branch/${branchId}/dashboard`} replace />
  return <>{children}</>
}
