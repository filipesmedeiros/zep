import { useEffect } from 'react'

import { usePreferences } from '../context/preferencesContext'
import { prefersDarkMode, togglePrefersDarkMode } from '../preferences/darkMode'

const useListenToColorMedia = () => {
  const { setPreference } = usePreferences()
  useEffect(() => {
    const listenToColorMedia = (ev: MediaQueryListEvent) => {
      setPreference('darkMode', ev.matches)
      togglePrefersDarkMode()
    }
    const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')
    setPreference('darkMode', colorMedia.matches)
    if (!prefersDarkMode()) togglePrefersDarkMode()
    colorMedia.addEventListener('change', listenToColorMedia)
  }, [setPreference])
}

export default useListenToColorMedia
