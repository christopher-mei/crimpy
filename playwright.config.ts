// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:5173', // Vite's default port
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
      },
    }
  ],
  // Remove staging for now until you have a real staging environment
};

export default config;