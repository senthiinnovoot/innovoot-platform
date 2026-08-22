import { NavLink, useParams } from 'react-router-dom'

import { Text } from '@components/ui'
import { Icon } from '@design-system/icons'
import { useBusinessContext } from '@modules/business-context'
import { cn } from '@shared/utils/cn'

/**
 * Nav items come from two sources: a fixed set of always-on items
 * (Dashboard, Forms, Leads) that every business type gets regardless of
 * its enabled-module list, and `businessType.modules` for vertical-specific
 * items (Patients, Appointments, ...). Forms and Leads are Common Platform
 * Capabilities per `INFORMATION_ARCHITECTURE.md` §5/§8 — not vertical
 * modules — so they are never gated by `RequireModule` or added to
 * `businessType.modules`; see docs/decisions for the rationale once
 * written up.
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
      <NavLink to={`${basePath}/forms`} className={linkClassName}>
        <Icon name="file-text" />
        <Text as="span" variant="body-sm">
          Forms
        </Text>
      </NavLink>
      <NavLink to={`${basePath}/leads`} className={linkClassName}>
        <Icon name="user" />
        <Text as="span" variant="body-sm">
          Leads
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
