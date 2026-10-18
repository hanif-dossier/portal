// Service worker portal markasku.my.id (18 Okt 2026). Menggantikan service worker Markasku lama di alamat ini:
// - salinan halaman Markasku lama dihapus (Markasku sekarang di app.markasku.my.id), portal selalu diambil dari jaringan;
// - notifikasi adzan yang terlanjur terdaftar di alamat lama tetap ditampilkan, dan saat diketuk membuka Markasku baru.
const BARU = u => String(u || '').replace(/^https:\/\/markasku\.my\.id\/?/, 'https://app.markasku.my.id/') || 'https://app.markasku.my.id/';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => clients.claim())));
self.addEventListener('push', e => {
  let p = {}; try { p = e.data ? e.data.json() : {}; } catch { p = { title: 'Markasku', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(p.title || 'Waktu sholat', {
    body: p.body || '', icon: 'ikon-192.png', badge: 'ikon-192.png', tag: p.tag || 'markas', renotify: true,
    vibrate: [200, 100, 200, 100, 400], data: { url: BARU(p.url || 'https://app.markasku.my.id/') }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = BARU((e.notification.data && e.notification.data.url) || 'https://app.markasku.my.id/');
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.navigate(url); return c.focus(); } }
    return clients.openWindow(url);
  }));
});
