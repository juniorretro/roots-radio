const CACHE_NAME = 'roots-radio-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/images/logo.png',
  '/images/default-cover.png',
  '/images/default-program.svg',
  '/logo192.png',
  '/logo512.png',
];

// Installation : mise en cache de l'app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => {})
    )
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

// Fetch : stratégie réseau d'abord, cache en fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter le stream audio ni les appels API
  if (
    url.hostname.includes('ecmanager') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/stream') ||
    url.pathname.includes('/socket.io')
  ) {
    return;
  }

  // Navigation : servir index.html depuis le cache si hors ligne
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets statiques : cache d'abord, réseau en fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
