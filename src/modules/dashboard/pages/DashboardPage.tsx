import { Card, CardContent, CardHeader, CardTitle, Text } from '@components/ui'
import { LoadingState } from '@components/feedback'
import { Icon } from '@design-system/icons'
import { useBusinessContext } from '@modules/business-context'

/**
 * Illustrative mock metrics only — no real per-module analytics API exists
 * yet. Keyed by module `key` so this stays generic: the same page would
 * show Rooms/Reservations/... metrics for a Hotel business type without
 * any code change here.
 */
const mockMetricByModuleKey: Record<string, { label: string; value: string }> = {
  patients: { label: 'Total Patients', value: '128' },
  appointments: { label: "Today's Appointments", value: '12' },
  pharmacy: { label: 'Prescriptions Filled', value: '340' },
  lab: { label: 'Pending Lab Orders', value: '27' },
  rooms: { label: 'Occupied Rooms', value: '18' },
}

export function DashboardPage() {
  const { data, isLoading } = useBusinessContext()

  if (isLoading || !data) return <LoadingState label="Loading dashboard…" />

  return (
    <div className="flex flex-col gap-6">
      <Text as="h1" variant="heading-lg">
        {data.businessType.name} Dashboard
      </Text>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.businessType.modules.map((module) => {
          const metric = mockMetricByModuleKey[module.key]
          return (
            <Card key={module.id}>
              <CardHeader className="flex-row items-center justify-between gap-2">
                <CardTitle className="text-body-sm text-muted-foreground font-medium">
                  {metric?.label ?? module.name}
                </CardTitle>
                <Icon name={module.icon} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Text as="p" variant="display-sm">
                  {metric?.value ?? '—'}
                </Text>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
