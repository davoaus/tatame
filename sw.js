// Service worker mínimo — habilita a instalação do PWA (Android/Chrome)
// Estratégia network-first para não servir bundle desatualizado.
const CACHE = 'beltup-shell-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// ---------- Notificações (Web Push) ----------
self.addEventListener('push', (event) => {
  let dados = {};
  try { dados = event.data ? event.data.json() : {}; } catch (e) { dados = {}; }
  const titulo = dados.titulo || 'BeltUp';
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.texto || '',
      icon: dados.icone || '/tatame/icon-192.png',
      badge: '/tatame/icon-192.png',
      tag: dados.tag || 'beltup',
      renotify: true,
      data: { url: dados.url || '/tatame/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destino = (event.notification.data && event.notification.data.url) || '/tatame/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const cliente of lista) {
        if (cliente.url.includes('/tatame') && 'focus' in cliente) {
          cliente.navigate(destino);
          return cliente.focus();
        }
      }
      return self.clients.openWindow(destino);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match(self.registration.scope)))
  );
});
