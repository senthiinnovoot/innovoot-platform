import '@testing-library/jest-dom/vitest'

// Global test setup — runs once before the Vitest suite. Add polyfills or
// global mocks here (e.g. matchMedia, ResizeObserver) as they're needed;
// keep it minimal otherwise.

// jsdom doesn't implement matchMedia. Needed by
// design-system/themes/theme.ts (getSystemTheme) whenever a component
// under test reads the system color-scheme preference.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
