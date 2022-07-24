self.addEventListener('push', evt => {
  const data = evt.data.json()
  console.log('Notification received', data)

  self.registration.showNotification(data.title, {
    body: data.body,
    data: {
      url: data.url,
    }
  })
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
