self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cache').then(cache => {
      return cache.addAll([
        '/favicon.ico',
        '/images/favicon-16x16.png',
        '/images/favicon-32x32.png',
        '/images/icon-big.png',
        '/images/icon-big.svg',
        '/images/icon-small.png',
        '/images/icon-maskable.png',
        'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
      ])
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(
      resp =>
        resp ||
        fetch(event.request).then(response =>
          event.request.method === 'GET' &&
          process.env.NODE_ENV !== 'development'
            ? caches.open('v1').then(cache => {
                cache.put(event.request, response.clone())
                return response
              })
            : response
        )
    )
  )
})
