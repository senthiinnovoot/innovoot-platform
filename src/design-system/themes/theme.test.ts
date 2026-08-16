import { afterEach, describe, expect, it } from 'vitest'

import {
  applyTheme,
  getInitialTheme,
  getStoredPreference,
  resolveTheme,
  storePreference,
  THEME_STORAGE_KEY,
} from './theme'

afterEach(() => {
  document.documentElement.classList.remove('dark')
  window.localStorage.clear()
})

describe('resolveTheme', () => {
  it('passes explicit themes through unchanged', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })
})

describe('storePreference / getStoredPreference', () => {
  it('round-trips a stored preference', () => {
    storePreference('dark')
    expect(getStoredPreference()).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('returns null when nothing is stored', () => {
    expect(getStoredPreference()).toBeNull()
  })
})

describe('applyTheme', () => {
  it('adds the dark class for dark theme', () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('removes the dark class for light theme', () => {
    document.documentElement.classList.add('dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})

describe('getInitialTheme', () => {
  it('honors an explicitly stored preference over system preference', () => {
    storePreference('dark')
    expect(getInitialTheme()).toBe('dark')
  })
})
