import { loadEnvFile } from 'node:process'

import { defineConfig } from 'vitest/config'

loadEnvFile('.env.dev')

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
})
