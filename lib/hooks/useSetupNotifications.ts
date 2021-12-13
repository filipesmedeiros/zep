import { useEffect } from 'react'

import useSetup from './useSetup'

const useSetupNotifications = () =>
  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission()
  }, [])

export default useSetupNotifications
