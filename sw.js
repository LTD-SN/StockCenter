const CACHE_NAME = "stock-distribuidora-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./firebase-config.js",
  "./vendor/firebase-app-compat.js",
  "./vendor/firebase-firestore-compat.js",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) {
    // No interceptar tráfico externo (Firebase, CDNs, APIs).
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  const networkFirstMatch =
    url.pathname.endsWith("/app.js") ||
    url.pathname.endsWith("/styles.css") ||
    url.pathname.endsWith("/firebase-config.js") ||
    url.pathname.endsWith("/manifest.json") ||
    url.pathname.endsWith("/firebase-app-compat.js") ||
    url.pathname.endsWith("/firebase-firestore-compat.js");
  if (networkFirstMatch) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  const cacheableDestinations = new Set(["script", "style", "image", "font", "manifest"]);
  if (!cacheableDestinations.has(req.destination)) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        });
    })
  );
});
