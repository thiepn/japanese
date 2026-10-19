# Japanese domain routing (candidate)

- Intended primary address: `https://japanese.thiepn.dev/` (Cloudflare Pages project `japanese`, GitHub `thiepn/japanese`, branch `main`).
- Short alias: `https://jp.thiepn.dev/` redirects with HTTP 301 to the primary address, preserving paths and query strings (Cloudflare zone redirect rule `jp_to_japanese_canonical`).
- Original candidate: `https://thiepn.dev/japanese/` remains accessible. Do **not** redirect it automatically: browser IndexedDB, CacheStorage, authentication and installed PWA state are origin-scoped, and cross-origin study progress does not migrate by changing DNS. Learners must intentionally export/import their original backup before switching.
- Both domains serve a **candidate**, not P22 stable production. Existing P11 external-language and P21 physical-device release gates remain independent and cannot be bypassed by the domain change.
- The existing auth provider hard-codes the Japanese callback to `https://thiepn.dev/japanese/auth/callback/`. Sign-in on the new origin is **not certified**; it needs coordinated Account-side authorization of the new callback, original PKCE and owner-isolation tests, and Japanese-side source changes before announcing authentication continuity. Do not silently redirect or relay authorization codes between origins.

## Cloudflare Pages build

The Pages project uses Node 24.15.0 and pnpm 11.19.0. It installs workspace dependencies, emits `release-meta.json` with `channel: candidate` and the Pages commit SHA, builds the monorepo with `VITE_PUBLIC_BASE=/` (the web Vite configuration defaults to `/`), and writes 404 and callback fallback entrypoints. Build output is `apps/web/dist`. Preview branch deployment is off; production builds follow GitHub `main`. A green build or a working custom domain must not change P22 release status to stable.
