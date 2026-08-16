import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { wcagContrast } from 'culori'
import { describe, expect, it } from 'vitest'

/**
 * Verifies WCAG contrast for our semantic color token pairs, in both
 * themes, by reading the actual values out of src/index.css — not a
 * hardcoded copy — so a future token edit that breaks contrast fails this
 * test instead of shipping silently. See docs/design-system/tokens.md for
 * the token list and docs/decisions for how these values were chosen.
 */

const dir = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(dir, '../../src/index.css'), 'utf-8')

function extractThemeVars(selector: 'root' | 'dark'): Record<string, string> {
  // Grabs every top-level `:root { ... }` or `.dark { ... }` block (there
  // are two `:root` blocks in the file — theme colors and radius — so this
  // merges all matching blocks rather than assuming exactly one).
  const blockPattern = selector === 'root' ? /:root\s*\{([^}]*)\}/g : /\.dark\s*\{([^}]*)\}/g
  const vars: Record<string, string> = {}
  for (const match of css.matchAll(blockPattern)) {
    const body = match[1]
    for (const decl of body.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
      vars[decl[1]] = decl[2].trim()
    }
  }
  return vars
}

// `--ring: var(--primary)` and similar aliases need one resolution pass.
function resolveAliases(vars: Record<string, string>): Record<string, string> {
  const resolved: Record<string, string> = { ...vars }
  for (const [key, value] of Object.entries(resolved)) {
    const aliasMatch = value.match(/^var\(--([a-z-]+)\)$/)
    if (aliasMatch && vars[aliasMatch[1]]) {
      resolved[key] = vars[aliasMatch[1]]
    }
  }
  return resolved
}

const light = resolveAliases(extractThemeVars('root'))
const dark = resolveAliases(extractThemeVars('dark'))

// [background token, foreground token, required ratio]
const textPairs: [string, string, number][] = [
  ['background', 'foreground', 4.5],
  ['background', 'muted-foreground', 4.5],
  ['surface', 'foreground', 4.5],
  ['surface-elevated', 'foreground', 4.5],
  ['primary', 'primary-foreground', 4.5],
  ['secondary', 'secondary-foreground', 4.5],
  ['accent', 'accent-foreground', 4.5],
  ['success', 'success-foreground', 4.5],
  ['warning', 'warning-foreground', 4.5],
  ['error', 'error-foreground', 4.5],
  ['info', 'info-foreground', 4.5],
]

describe.each([
  ['light', light],
  ['dark', dark],
])('%s theme token contrast', (_themeName, theme) => {
  it.each(textPairs)('%s / %s meets WCAG AA (>= %s:1)', (bg, fg, minRatio) => {
    expect(theme[bg], `--${bg} not found in CSS`).toBeTruthy()
    expect(theme[fg], `--${fg} not found in CSS`).toBeTruthy()
    const ratio = wcagContrast(theme[bg], theme[fg])
    expect(ratio).toBeGreaterThanOrEqual(minRatio)
  })

  it('focus ring is clearly visible against background and surface (>= 3:1)', () => {
    expect(wcagContrast(theme.background, theme.ring)).toBeGreaterThanOrEqual(3)
    expect(wcagContrast(theme.surface, theme.ring)).toBeGreaterThanOrEqual(3)
  })
})
