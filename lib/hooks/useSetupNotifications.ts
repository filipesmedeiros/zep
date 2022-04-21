import { useEffect } from 'react'

import showNotification from '../showNotification'

const useSetupNotifications = () =>
  useEffect(() => {
    if (Notification?.permission === 'default')
      Notification.requestPermission().then(() =>
        showNotification({
          title: 'Your browser supports notifications',
          body: 'notis',
          tag: 'allowed_notifications',
        })
      )
  }, [])

export default useSetupNotifications
