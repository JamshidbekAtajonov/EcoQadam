const VERSION = "ecoqadam-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const STATIC_ASSETS = ["/offline.html", "/manifest.webmanifest", "/og.png", "/icon"];
const CORE_ROUTES = [
  "/learn", "/quiz",
  "/learn/har-bir-tomchi-qadrli", "/learn/qurgoqchilikni-tushunamiz",
  "/learn/yosh-daraxtga-gamxorlik", "/learn/aqlli-sugorish",
  "/learn/chiqindini-ajratamiz", "/learn/toza-havo-uchun",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "PRECACHE_CORE") {
    event.waitUntil(caches.open(PAGE_CACHE).then((cache) => Promise.allSettled(CORE_ROUTES.map(async (route) => {
      const response = await fetch(route, { credentials: "include" });
      if (response.ok) await cache.put(route, response);
    }))));
  }
  if (event.data?.type === "CLEAR_PRIVATE_CACHE") {
    event.waitUntil(caches.delete(PAGE_CACHE));
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (url.pathname.startsWith("/_next/static/") || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === "navigate" || url.pathname.startsWith("/learn") || url.pathname.startsWith("/quiz")) {
    event.respondWith(networkFirst(request));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "ecoqadam-sync") {
    event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => clients.forEach((client) => client.postMessage({ type: "SYNC_REQUEST" }))));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(cacheName)).put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match(new URL(request.url).pathname)) || (await caches.match("/offline.html"));
  }
}
