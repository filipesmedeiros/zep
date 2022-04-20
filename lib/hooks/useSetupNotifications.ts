import { useEffect } from 'react'

import isiOS from '../isiOS'

const useSetupNotifications = () =>
  useEffect(() => {
    if (isiOS() && Notification.permission === 'default')
      Notification.requestPermission()
  }, [])

export default useSetupNotifications
