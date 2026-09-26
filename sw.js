// Service worker mínimo — habilita a instalação do PWA (Android/Chrome)
// Arquivos com hash (bundle, imagens, fontes): cache primeiro — abrem na hora.
// Páginas: rede primeiro, para nunca servir uma versão velha do app.
// build: 20260926152400  (carimbado a cada deploy p/ o navegador detectar versão nova)
const CACHE = 'beltup-shell-20260926152400';

// Arquivos essenciais do app, carimbados na hora do build. Ficam guardados
// já na instalação: é isso que faz o BeltUp abrir sem internet.
const ESSENCIAIS = ["/tatame/", "/tatame/_expo/static/js/web/entry-1e1fb515ff9d66170c3d0db2f551890d.js", "/tatame/_expo/static/js/web/jsQR-8d8a5bab19f17fb9e09b6480b2947259.js", "/tatame/assets/assets/hero-lutador.1d34dfab732aabcff4ce394a03d8114a.jpg", "/tatame/assets/assets/logo-b.9edf2553099159ec41be80fb89bc13e4.png", "/tatame/assets/assets/logo-nome.6f6b8c47a7d1814860fe4d96f8b3ff16.png", "/tatame/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.b4eb097d35f44ed943676fd56f6bdc51.ttf", "/tatame/index.html", "/tatame/manifest.json"];
// Imagens do app (faixas, ícones). Baixadas em segundo plano, depois que o
// app já abriu, para não disputar banda na primeira abertura.
const EXTRAS = ["/tatame/assets/assets/faixas/amarela.cd642d02fc61ee048479cd52961e9c70.png", "/tatame/assets/assets/faixas/amarela_branca.43291c94faaf2c7af377d1c367003201.png", "/tatame/assets/assets/faixas/amarela_preta.f730dacbdd0d7708b8f88e2429c0ebc5.png", "/tatame/assets/assets/faixas/azul.12a41b58d47c3746cd9cca6dfe2fac59.png", "/tatame/assets/assets/faixas/branca.d1c6f47cb269cd8b666f6ed25a216c27.png", "/tatame/assets/assets/faixas/cinza.5a51d01f51f495a50423c9dae35ae164.png", "/tatame/assets/assets/faixas/cinza_branca.b595a85a7b8db29450ce445d9114c59b.png", "/tatame/assets/assets/faixas/cinza_preta.d31784510459a51b8788baa82bf8a8f5.png", "/tatame/assets/assets/faixas/coral.e79f21559c25e01a43bd86a944ba5f4c.png", "/tatame/assets/assets/faixas/laranja.c5a28b67e7166f113bac1b5224cb9cc6.png", "/tatame/assets/assets/faixas/laranja_branca.c1e021365245d7a3e04920d892be967e.png", "/tatame/assets/assets/faixas/laranja_preta.900aa65a60f25d02273ef25be47dab3f.png", "/tatame/assets/assets/faixas/marrom.227ba00e39282653d6eb1b020d866783.png", "/tatame/assets/assets/faixas/preta.7a4b4aedff00d320adb2d394daad7aa2.png", "/tatame/assets/assets/faixas/roxa.13c6fb1412ce6407e6f09d1db4fdf2be.png", "/tatame/assets/assets/faixas/verde.5a9371eb6f670782ba8e1aa044259cd3.png", "/tatame/assets/assets/faixas/verde_branca.f310d46378c7d1f387cde1da3761e275.png", "/tatame/assets/assets/faixas/verde_preta.1ce75f83216bc7abc95c557c532bf162.png", "/tatame/assets/assets/faixas/vermelha.22a35c21ebe2e84cef1d6bb026432d36.png", "/tatame/assets/node_modules/expo-router/assets/arrow_down.017bc6ba3fc25503e5eb5e53826d48a8.png", "/tatame/assets/node_modules/expo-router/assets/error.d1ea1496f9057eb392d5bbf3732a61b7.png", "/tatame/assets/node_modules/expo-router/assets/file.19eeb73b9593a38f8e9f418337fc7d10.png", "/tatame/assets/node_modules/expo-router/assets/forward.d8b800c443b8972542883e0b9de2bdc6.png", "/tatame/assets/node_modules/expo-router/assets/pkg.ab19f4cbc543357183a20571f68380a3.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/back-icon-mask.0a328cd9c1afd0afe8e3b1ec5165b1b4.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@2x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@3x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@4x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@2x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@3x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@4x.png", "/tatame/assets/node_modules/expo-router/assets/react-navigation/elements/search-icon.286d67d3f74808a60a78d3ebf1a5fb57.png", "/tatame/assets/node_modules/expo-router/assets/sitemap.412dd9275b6b48ad28f5e3d81bb1f626.png", "/tatame/assets/node_modules/expo-router/assets/unmatched.20e71bdf79e3a97bf55fd9e164041578.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(ESSENCIAIS.map((u) => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting()),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      // com o app já no ar, completa o acervo para funcionar offline de verdade
      .then(() => caches.open(CACHE))
      .then((c) => Promise.allSettled(EXTRAS.map((u) => c.match(u).then((tem) => (tem ? null : c.add(u).catch(() => {})))))),
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

  const url = new URL(req.url);

  // As fotos de perfil (Supabase Storage) NÃO passam por aqui: no iPhone,
  // responder por elas pelo service worker deixava a foto em branco.
  // Chamadas ao Supabase (dados e imagens) nunca passam pelo cache do app.
  if (url.origin !== self.location.origin) return;

  // Arquivos com hash no nome (bundle, imagens, fontes) nunca mudam de
  // conteúdo: servimos do cache na hora e só baixamos na primeira vez.
  // Era isto que fazia o app baixar tudo de novo a cada abertura.
  const estatico = /\/(_expo\/static|assets)\//.test(url.pathname)
    || /\.(js|css|png|jpg|jpeg|webp|svg|ttf|woff2?|ico)$/.test(url.pathname);

  if (estatico) {
    event.respondWith(
      caches.match(req).then((cacheado) => cacheado || fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        return res;
      })),
    );
    return;
  }

  // Páginas e o resto: rede primeiro (para pegar versão nova), cache como
  // reserva. Sem internet, cai na última página guardada e o app abre normal.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(
        (r) => r || caches.match(self.registration.scope) || caches.match(new URL('index.html', self.registration.scope).href),
      )),
  );
});
