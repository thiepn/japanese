import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@thiepn/study-player": fileURLToPath(new URL("./packages/study-player/src/index.ts", import.meta.url))
    }
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.mjs"],
    exclude: ["tests/e2e/**"]
  }
});
