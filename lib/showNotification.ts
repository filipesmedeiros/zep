const showNotification = async (params: {
  title: string
  body: string
  tag?: string
  actions?: NotificationAction[]
}) => {
  const sw = await navigator.serviceWorker.getRegistration()
  sw?.showNotification?.(params.title, {
    body: params.body,
    renotify: params.tag !== undefined,
    tag: params.tag,
    icon: '/images/icon-small.png',
    actions: params.actions,
  })
}

export default showNotification
