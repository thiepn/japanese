const CACHE_PREFIX = "japanese-shell-";
const CACHE = `${CACHE_PREFIX}v3`;
const BASE = new URL(self.registration.scope).pathname;
const CORE = [BASE, `${BASE}manifest.webmanifest`, `${BASE}icon.svg`];

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
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (
    requestUrl.origin !== self.location.origin ||
    !requestUrl.pathname.startsWith(BASE)
  ) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
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
