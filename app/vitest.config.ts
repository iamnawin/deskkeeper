import { defineConfig } from 'vitest/config'

// Unit tests run against pure main-process logic (no Electron runtime).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'native-host/**/*.test.js'],
  },
})
