import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Western Ghats Multi-Agent Landslide Early Warning System (LEWS).
 * Supports Desktop (Chrome, Firefox, Safari) and Mobile Viewports (Pixel 5, iPhone 13).
 */
export default defineConfig({
  testDir: "./e2e/tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 7000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
    ["json", { outputFile: "playwright-report/test-results.json" }],
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  projects: [
    {
      name: "Desktop Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Desktop WebKit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome (Pixel 5)",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari (iPhone 13)",
      use: { ...devices["iPhone 13"] },
    },
  ],

  // Automatically start dev server if not already running
  webServer: [
    {
      command: "npm run dev:frontend",
      url: "http://localhost:5173",
      reuseExistingServer: true,
      timeout: 60 * 1000,
    },
    {
      command: "npm run dev:backend",
      url: "http://localhost:5000/api/health",
      reuseExistingServer: true,
      timeout: 60 * 1000,
    },
  ],
});
