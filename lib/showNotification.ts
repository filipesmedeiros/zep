const showNotification = async (params: {
  title: string
  body: string
  tag?: string
}) => {
  const sw = await navigator.serviceWorker.getRegistration()
  sw?.showNotification(params.title, {
    body: params.body,
    renotify: params.tag !== undefined,
    tag: params.tag,
    icon: '/images/icon-small.png',
  })
}

export default showNotification
