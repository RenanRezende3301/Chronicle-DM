import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'
import process from 'node:process'

const configuredChromium = process.env.PLAYWRIGHT_CHROMIUM_PATH
const systemChromium = '/usr/bin/chromium'
const executablePath =
  configuredChromium || (existsSync(systemChromium) ? systemChromium : undefined)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      ...(executablePath ? { executablePath } : {}),
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command:
      'VITE_AUTH_BACKEND=legacy npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
