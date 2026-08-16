import { Text, ThemeToggle } from '@components/ui'
import { useBusinessContext } from '@modules/business-context'

export function TopBar() {
  const { data } = useBusinessContext()

  return (
    <header className="bg-surface border-border flex h-16 shrink-0 items-center justify-between border-b px-6">
      <div className="flex flex-col">
        <Text as="span" variant="heading-sm">
          {data?.business.name ?? 'Loading…'}
        </Text>
        {data && (
          <Text as="span" variant="caption">
            {data.branch.name} · {data.businessType.name}
          </Text>
        )}
      </div>
      <ThemeToggle />
    </header>
  )
}
