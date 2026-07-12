const CACHE_NAME = "futma360-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/logo/futma360_2.png",
  "/manifest.json"
];

// Install event: cache the application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve from cache, update in background (Stale-While-Revalidate)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching third-party map tiles, external API posts, and browser extension assets
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension") ||
    requestUrl.host.includes("basemaps.cartocdn.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background to update cache for next time
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => { /* silent catch for offline situations */ });
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache local assets dynamically
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (requestUrl.origin === self.location.origin || requestUrl.host.includes("fonts"))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
