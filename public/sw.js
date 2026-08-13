const CACHE_NAME = 'camino-companion-v7';
const TILE_CACHE = 'camino-tiles-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg'
];

// 1. Instalación y Precarga
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// 2. Activación y Purga de Cachés Antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== TILE_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Helper: Fetch con Timeout para evitar bloqueos en cobertura 2G/degradada
const fetchWithTimeout = (request, timeoutMs = 2000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network Timeout')), timeoutMs);
    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// 3. Intercepción Inteligente de Red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones de extensiones o protocolos no soportados por caché
  if (!url.protocol.startsWith('http')) return;

  // A. Tiles del mapa: Cache First con fallback
  if (url.host.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return cachedResponse || new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // B. Navegación e Inserción de Código (JS, CSS, HTML): Stale-While-Revalidate / Network-First Rápido
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      // Si tenemos caché y es una petición de navegación (página), devolvemos caché si la red tarda > 1.5s
      try {
        const networkPromise = fetchWithTimeout(event.request, 1500).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Si hay respuesta cacheada, intentamos red, pero caemos a caché si falla o expira el tiempo
        if (cachedResponse) {
          return networkPromise.catch(() => cachedResponse);
        }

        return await networkPromise;
      } catch (error) {
        if (cachedResponse) return cachedResponse;

        // Fallback final a index.html para Single Page App (SPA)
        if (event.request.mode === 'navigate') {
          const fallback = await cache.match('/index.html');
          if (fallback) return fallback;
        }

        return new Response('Sin conexión offline disponible', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })
  );
});