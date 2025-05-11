const CACHE_NAME = "story-ai-cache-v1";
const urlsToCache = [
  "/index.html", // Or your main HTML file, e.g., '/index.html'
  "/?page=home", // Cache the default start_url

  // == Add paths to your critical CSS files ==
  // e.g., '/css/main.css',

  // == Add paths to your critical JavaScript files ==
  "/js/index.js", // Your main application script

  // Consider caching files from your js/utils/ directory if they are loaded directly by HTML
  // and are essential for the initial app shell.
  "/js/utils/cloud.js",
  "/js/utils/encode.js",
  "/js/utils/gemini.js",
  "/js/utils/helpers.js",

  // == Add paths to your PWA icons and any other essential static assets ==
  "/favicon.ico",
  // "/manifest.json",

  // == Optionally, add other important pages for offline access ==
  "/?page=stories",
  "/?page=write",
  // '/?page=read',
];

self.addEventListener("install", (/** @type {ExtendableEvent} */ event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache and caching initial assets");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (/** @type {FetchEvent} */ event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Cache hit - return response
      }
      return fetch(event.request).then((fetchResponse) => {
        if (
          !fetchResponse ||
          fetchResponse.status !== 200 ||
          fetchResponse.type !== "basic" ||
          event.request.method !== "GET"
        ) {
          return fetchResponse;
        }
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
