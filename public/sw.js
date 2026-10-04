// v3: the previous worker cached every same-origin file cache-first, including Vite's dev modules,
// so pages could load a mix of old and new code. Bumping the name clears those caches on activate.
const CACHE_NAME = 'portfolio-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/favicon.svg'
];

// Only these are safe to serve cache-first: Vite's hashed build files never change content
const IMMUTABLE = /^\/assets\//;

// Dev-server URLs must always come from the network
const isDevRequest = (url) => url.pathname.startsWith('/src/')
    || url.pathname.startsWith('/@')
    || url.pathname.startsWith('/node_modules/')
    || url.searchParams.has('v')
    || url.searchParams.has('t');

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
        ))
    );
    self.clients.claim();
});

const networkFirst = (request) => fetch(request)
    .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
    })
    .catch(() => caches.match(request));

const cacheFirst = (request) => caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response && response.status === 200 && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
}));

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip cross-origin, non-GET and dev-server requests entirely
    if (url.origin !== self.location.origin || event.request.method !== 'GET' || isDevRequest(url)) {
        return;
    }

    if (IMMUTABLE.test(url.pathname)) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Pages, images, manifest: always try the network, fall back to the cache when offline
    event.respondWith(networkFirst(event.request));
});
