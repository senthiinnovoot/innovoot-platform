import { NavLink, useParams } from 'react-router-dom'

import { Text } from '@components/ui'
import { Icon } from '@design-system/icons'
import { useBusinessContext } from '@modules/business-context'
import { cn } from '@shared/utils/cn'

/**
 * Generated entirely from `useBusinessContext()`'s enabled-module list —
 * never a hardcoded per-business-type menu. Dashboard is the one item
 * that's always present (every business type gets one); every other item
 * comes directly from `businessType.modules`.
 */
export function Sidebar() {
  const { businessId, branchId } = useParams<{ businessId: string; branchId: string }>()
  const { data } = useBusinessContext()
  const basePath = `/b/${businessId}/branch/${branchId}`

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-150 ease-in-out',
      'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted',
    )

  return (
    <nav
      aria-label="Main"
      className="bg-surface border-border flex w-56 shrink-0 flex-col gap-1 border-r p-3"
    >
      <NavLink to={`${basePath}/dashboard`} className={linkClassName}>
        <Icon name="layout-dashboard" />
        <Text as="span" variant="body-sm">
          Dashboard
        </Text>
      </NavLink>
      {data?.businessType.modules.map((module) => (
        <NavLink key={module.id} to={`${basePath}/${module.key}`} className={linkClassName}>
          <Icon name={module.icon} />
          <Text as="span" variant="body-sm">
            {module.name}
          </Text>
        </NavLink>
      ))}
    </nav>
  )
}
