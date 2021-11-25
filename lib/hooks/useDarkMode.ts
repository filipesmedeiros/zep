import { useEffect } from 'react'

import { getPreference } from '../db/preferences'

const useDarkMode = (darkMode?: boolean) => {
  useEffect(() => {
    const setDarkModeClass = async () => {
      const isDark =
        darkMode ??
        (await getPreference('darkMode')) ??
        window.matchMedia('(prefers-color-scheme: dark)').matches
      const htmlClasses = document.querySelector('html')?.classList
      if (isDark) htmlClasses?.add('dark')
      else htmlClasses?.remove('dark')
    }
    setDarkModeClass()
  }, [darkMode])
}

export default useDarkMode
