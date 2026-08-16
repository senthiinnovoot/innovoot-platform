/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const src = (...segments: string[]) => path.resolve(dirname, 'src', ...segments)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Keep these aliases in sync with tsconfig.app.json "paths"
    alias: {
      '@app': src('app'),
      '@modules': src('modules'),
      '@components': src('components'),
      '@shared': src('shared'),
      '@design-system': src('design-system'),
      '@infrastructure': src('infrastructure'),
      '@': src(),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['tests/e2e/**'],
    },
  },
})
