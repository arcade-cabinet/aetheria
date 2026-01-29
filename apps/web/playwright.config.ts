import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8088',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false, // Force visible browser
        launchOptions: {
            args: ["--enable-gpu", "--use-gl=desktop"],
            slowMo: 100, // Slow down operations by 100ms to be observable
        }
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:8088',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
