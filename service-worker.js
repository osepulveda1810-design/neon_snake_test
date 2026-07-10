

// Sube este número en cada actualización que publiques (ej: 'neon-snake-v3', 'v4'...).
// Cambiar el nombre del caché fuerza a que los usuarios reciban los archivos nuevos.
const CACHE_NAME = 'neon-snake-v2.2';

const ARCHIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './snakebyte.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalación: guarda los archivos base en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CACHE))
  );
  self.skipWaiting();
});

// Activación: borra cachés de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

// Estrategia "network-first": intenta traer la versión más reciente del
// servidor primero. Si no hay internet, usa la copia guardada en caché.
// Así, cuando actualices el juego, los usuarios con internet reciben
// el cambio de inmediato; sin internet, el juego sigue funcionando offline.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(event.request))
  );
});
