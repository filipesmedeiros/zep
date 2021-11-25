import { useEffect } from 'react'

import { usePreferences } from '../context/preferencesContext'

const useListenToColorMedia = () => {
  const { setPreference } = usePreferences()
  useEffect(() => {
    const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const listenToColorMedia = (ev: MediaQueryListEvent) => {
      setPreference('darkMode', ev.matches)
    }
    colorMedia.addEventListener('change', listenToColorMedia)
    return () => colorMedia.removeEventListener('change', listenToColorMedia)
  }, [setPreference])
}

export default useListenToColorMedia
