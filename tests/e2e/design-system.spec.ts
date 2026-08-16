import { expect, test } from '@playwright/test'

/**
 * Real-browser verification that theming actually works end to end — unit
 * tests cover the token contrast math and the ThemeProvider's DOM
 * side-effects in jsdom, but only a real browser proves the CSS variables
 * genuinely repaint the page. Not a "business flow" e2e test (there are
 * none yet); this exists specifically to satisfy Phase 2's quality gate
 * ("verify light theme works, dark theme works").
 */

test('design-system showcase renders with all foundational components', async ({ page }) => {
  await page.goto('/design-system')
  await expect(page.getByRole('heading', { name: 'Innovoot Design System' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible()
  await expect(page.getByLabel('Email address')).toBeVisible()
})

test('theme toggle switches the applied theme and repaints the page', async ({ page }) => {
  await page.goto('/design-system')
  const html = page.locator('html')

  const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false
  const initialBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)

  await page.getByRole('button', { name: /switch to (light|dark) theme/i }).click()

  await expect(html).toHaveClass(initiallyDark ? /^(?!.*dark).*$/ : /dark/)
  const toggledBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(toggledBg).not.toBe(initialBg)
})

test('theme preference persists across reload', async ({ page }) => {
  await page.goto('/design-system')
  await page.getByRole('button', { name: /switch to (light|dark) theme/i }).click()
  const classAfterToggle = await page.locator('html').getAttribute('class')

  await page.reload()
  await expect(page.locator('html')).toHaveClass(classAfterToggle ?? '')
})
