import { defineConfig, devices } from "@playwright/test";

const PUBLIC_BASE = normalizeBase(process.env.VITE_PUBLIC_BASE);
const PREVIEW_ORIGIN = "http://127.0.0.1:4173";
const APP_URL = new URL(PUBLIC_BASE, PREVIEW_ORIGIN).href;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  repeatEach: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: APP_URL,
    trace: "retain-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "android-mobile", use: { ...devices["Pixel 7"] } },
    { name: "compact-mobile", use: { browserName:"chromium",viewport:{width:360,height:740},isMobile:true,hasTouch:true } }
  ],
  webServer: {
    command: "pnpm --filter @thiepn/japanese-web preview --host 127.0.0.1 --port 4173",
    url: APP_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});

function normalizeBase(value:string|undefined):string{
  const raw=(value??"/").trim()||"/";
  const withLeading=raw.startsWith("/")?raw:`/${raw}`;
  return withLeading.endsWith("/")?withLeading:`${withLeading}/`;
}
