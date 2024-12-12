self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('tile-cache').then(cache => {
      console.log('Cache created', cache);
    }),
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = event.request.url;
  if (requestUrl.includes('mts.daumcdn.net')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(fetchResponse => {
            return caches.open('tile-cache').then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      }),
    );
  }
});
