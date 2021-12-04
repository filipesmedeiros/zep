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

self.addEventListener('fetch', async event => {
  event.waitUntil(async () => {
    let resp = await caches.match(event.request)
    if (resp === undefined) {
      resp = await fetch(event.request)

      if (event.request.method === 'GET') {
        const cache = await caches.open('v1')
        await cache.put(event.request, resp.clone())
      }
    }
    return event.respondWith(resp)
  })
})
