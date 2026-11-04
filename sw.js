// Service Worker: App-Dateien offline verfügbar, index.html zuerst aus dem Netz (damit Updates ankommen)
const CACHE = 'ppp-d2836e6ccb';
const CORE = ['./', './index.html', './app.webmanifest', './firebase-config.js', './icons/icon.svg', './icons/app-192.png', './icons/app-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ppp-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
function store(req, res) {
  if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
}
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const fresh = req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/firebase-config.js');
    if (fresh) {
      e.respondWith(fetch(req).then((res) => store(req, res)).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))));
    } else {
      e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => store(req, res))));
    }
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then((r) => {
      const net = fetch(req).then((res) => store(req, res)).catch(() => r);
      return r || net;
    }));
  }
});
