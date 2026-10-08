// Imported into the generated service worker (see workbox.importScripts in vite.config.js).
// Tapping a Moon Mood notification focuses an open window, or opens the app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
