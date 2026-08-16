import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // This environment ships a pre-installed Chromium at a fixed path
        // rather than letting Playwright download its own pinned revision
        // (network-restricted sandbox) — see CLAUDE.md testing notes.
        launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
  ],
  // Runs against the dev server, not `pnpm preview` (production build),
  // because the only e2e coverage that exists right now (the
  // design-system showcase) is a dev-only route by design — see
  // app/routes/router.tsx. Switch to `pnpm preview` / port 4173 once real
  // business-flow e2e tests exist that need production-accurate output,
  // and either exclude this spec from that run or stop dev-gating the
  // showcase route.
  webServer: {
    command: 'pnpm exec vite --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
