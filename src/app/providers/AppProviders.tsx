import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

import { ThemeProvider } from '@design-system/themes/theme-provider'

/**
 * Composition root for app-wide providers (server-state cache, theming,
 * auth context, etc.). Add new global providers here — one place, one
 * ordering, rather than scattering `<XProvider>` wrappers around the tree.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
