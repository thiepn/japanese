const CACHE_PREFIX = "japanese-shell-";
const CACHE = `${CACHE_PREFIX}v6`;
const BASE = new URL(self.registration.scope).pathname;
const CORE = [BASE, `${BASE}manifest.webmanifest`, `${BASE}icon.svg`, `${BASE}icon-192.png`, `${BASE}icon-512.png`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (
    requestUrl.origin !== self.location.origin ||
    !requestUrl.pathname.startsWith(BASE)
  ) return;
  // Never persist an OAuth code/token in a CacheStorage request key. These
  // routes require a network round trip and cannot use an offline login page.
  if (requestUrl.pathname.startsWith(`${BASE}auth/`) || requestUrl.hash) return;

  // Primary navigation stores its selected screen in a query parameter.
  // Allow only a known view at the exact app root, never OAuth, arbitrary
  // parameters, duplicates, or query-bearing resource requests.
  // Do not write query-bearing requests to CacheStorage even on success.
  if (requestUrl.search) {
    const entries = [...requestUrl.searchParams.entries()];
    const safeView = requestUrl.pathname === BASE &&
      event.request.mode === "navigate" &&
      entries.length === 1 && entries[0][0] === "view" &&
      ["Today", "Learn", "Kana", "Immerse", "Library", "Progress"].includes(entries[0][1]);
    if (!safeView) return;
    event.respondWith(fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE);
      const shell = await cache.match(BASE);
      if (shell) return shell;
      throw new Error("Offline shell unavailable");
    }));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE)
            .then((cache) => cache.put(event.request, copy)).catch(() => {}));
        }
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") return cache.match(BASE);
        throw new Error("Offline resource unavailable");
      }),
  );
});
