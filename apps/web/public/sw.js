const CACHE_PREFIX = "japanese-shell-";
const CACHE = `${CACHE_PREFIX}v7`;
const VOCAB_CACHE = `${CACHE_PREFIX}vocab-v4`;
const MAX_VOCAB_IMAGES = 48;
let imageCacheWrites = Promise.resolve();
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
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE && key !== VOCAB_CACHE)
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
  if (requestUrl.pathname.startsWith(`${BASE}auth/`) ||
      requestUrl.search || requestUrl.hash) return;

  // Cache encountered illustrations only; storage failure must not block the network.
  if (event.request.destination === "image" && requestUrl.pathname.startsWith(`${BASE}vocab/`) && requestUrl.pathname.endsWith(".svg")) {
    const responsePromise = (async () => {
      const hit = await caches.open(VOCAB_CACHE).then(cache => cache.match(event.request)).catch(() => null);
      if (hit) return hit;
      const response = await fetch(event.request);
      if (response.ok) {
        const copy = response.clone();
        // Serialize cache writes and FIFO eviction to keep concurrent loads within the cap.
        imageCacheWrites = imageCacheWrites.then(async () => {
          try {
            const cache = await caches.open(VOCAB_CACHE);
            await cache.put(event.request, copy);
            const keys = await cache.keys();
            for (const key of keys.slice(0, Math.max(0, keys.length - MAX_VOCAB_IMAGES))) await cache.delete(key);
          } catch { /* Storage is optional; the online image response remains usable. */ }
        }).catch(() => {});
      }
      return response;
    })();
    event.respondWith(responsePromise);
    // Register lifetime extension during the fetch event, not after awaited network I/O.
    // Awaiting responsePromise ensures the imageCacheWrites assignment has occurred.
    event.waitUntil(responsePromise.then(() => imageCacheWrites).catch(() => {}));
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
