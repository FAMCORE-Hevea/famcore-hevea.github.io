import { defineConfig } from '@playwright/test'

// Testes de navegador, só para rodar localmente: npm run test:e2e
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4179', browserName: 'chromium' },
  webServer: {
    command: 'npm run build && npx vite preview --port 4179 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4179',
  },
})
