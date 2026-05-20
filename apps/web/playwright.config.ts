import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    // nginx serves https://taskmanager.test (add to hosts: 127.0.0.1 taskmanager.test)
    baseURL: 'https://taskmanager.test',
    ignoreHTTPSErrors: true,
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
