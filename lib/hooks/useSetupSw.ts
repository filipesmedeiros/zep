import { useCallback } from 'react'

import useSetup from './useSetup'

const useSetupSw = (skip?: boolean) =>
  useSetup(
    useCallback(() => {
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

export default useSetupSw
