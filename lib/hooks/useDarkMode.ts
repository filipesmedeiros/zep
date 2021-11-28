import { useCallback, useEffect } from 'react'

import { getPreference } from '../db/preferences'

const useDarkMode = () => {
  const setDarkMode = useCallback(async (darkMode: boolean) => {
    const htmlClasses = document.querySelector('html')?.classList
    if (darkMode) htmlClasses?.add('dark')
    else htmlClasses?.remove('dark')
  }, [])

  useEffect(() => {
    const darkModeOnStarup = async () => {
      const darkMode =
        (await getPreference('darkMode')) ??
        window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(darkMode)
    }
    darkModeOnStarup()
  }, [setDarkMode])

  return setDarkMode
}

export default useDarkMode
