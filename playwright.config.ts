import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  repeatEach: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "android-mobile", use: { ...devices["Pixel 7"] } },
    { name: "compact-mobile", use: { browserName:"chromium",viewport:{width:360,height:740},isMobile:true,hasTouch:true } }
  ],
  webServer: {
    command: "pnpm --filter @thiepn/japanese-web preview --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
