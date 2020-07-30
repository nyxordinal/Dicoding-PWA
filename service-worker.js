const CACHE_NAME = 'vanir-v1';
const urlsToCache = [
	'/css',
	'/images',
	'/js',
	'/pages',
	'/favicon.ico',
	'/index.html',
	'/manifest.json',
	'/nav.html',
	'/service-worker.js',
	'/css/materialize.min.css',
	'/css/style.css',
	'/images/icon',
	'/images/background.jpg',
	'/images/logo.png',
	'/images/no-image.png',
	'/images/icon/apple-touch-icon-180x180.png',
	'/images/icon/favicon-16x16.png',
	'/images/icon/favicon-32x32.png',
	'/images/icon/pwa-192x192_maskable.png',
	'/images/icon/pwa-512x512_maskable.png',
	'/js/api.js',
	'/js/db.js',
	'/js/idb.js',
	'/js/init.js',
	'/js/installSW.js',
	'/js/materialize.min.js',
	'/js/nav.js',
	'/pages/competition.html',
	'/pages/developer.html',
	'/pages/favorite.html',
	'/pages/home.html',
	'/pages/team.html',
	'https://code.jquery.com/jquery-2.1.1.min.js',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v53/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				return cache.addAll(urlsToCache);
			})
	);
})

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys()
			.then(function (cacheNames) {
				return Promise.all(
					cacheNames.map(function (cacheName) {
						if (cacheName != CACHE_NAME) {
							console.log("ServiceWorker: cache " + cacheName + " deleted");
							return caches.delete(cacheName);
						}
					})
				);
			})
	);
})

self.addEventListener('fetch', function (event) {

	event.respondWith(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.match(event.request).then(function (response) {
				let fetchPromise = fetch(event.request).then(function (networkResponse) {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				})
				return response || fetchPromise;
			})
		})


	);
});

self.addEventListener('push', function (event) {
	let body;
	const title = 'Vanir Notification';
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	const options = {
		body: body,
		icon: 'images/logo.png',
		badge: 'images/logo.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};
	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});