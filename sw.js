const CACHE_NAME = 'reachin-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon_io/site.webmanifest',
  '/favicon_io/android-chrome-192x192.png',
  '/favicon_io/android-chrome-512x512.png',
  '/favicon_io/apple-touch-icon.png',
  '/favicon_io/favicon-32x32.png',
  '/favicon_io/favicon-16x16.png'
];

// Service Worker Install hone par files cache karega
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Naya version aane par purana cache delete karega (Auto-update logic)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Offline support ke liye fetch event
self.addEventListener('fetch', (event) => {
  // Non-GET requests aur Google Script/IP APIs ko direct network pe jane dein
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('script.google.com') ||
    event.request.url.includes('ipapi.co')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return cacheRes || fetch(event.request);
    })
  );
});