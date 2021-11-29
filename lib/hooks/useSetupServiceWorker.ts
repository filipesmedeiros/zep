import { useCallback } from 'react'

import useSetup from './useSetup'

const useSetupServiceWorker = (skip?: boolean) =>
  useSetup(
    useCallback(async () => {
      if ('serviceWorker' in navigator) {
        try {
          navigator.serviceWorker.register('/sw.js')
        } catch {}
      } else {
        console.log('no service worker')
      }
    }, []),
    skip
  )

export default useSetupServiceWorker
