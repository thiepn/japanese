import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe,expect,it } from "vitest";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const serviceWorker=fs.readFileSync(path.join(ROOT,"apps/web/public/sw.js"),"utf8");

describe("Japanese PWA cache boundary",()=>{
  it("only removes Japanese-owned caches",()=>{
    expect(serviceWorker).toContain('key.startsWith(CACHE_PREFIX) && key !== CACHE');
    expect(serviceWorker).not.toContain('keys.filter((key) => key !== CACHE)');
  });

  it("does not intercept data outside the Japanese origin + subpath",()=>{
    expect(serviceWorker).toContain('requestUrl.origin !== self.location.origin');
    expect(serviceWorker).toContain('!requestUrl.pathname.startsWith(BASE)');
  });
});
