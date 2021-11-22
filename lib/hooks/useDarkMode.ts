import { useEffect } from 'react'

import { prefersDarkMode } from '../preferences/darkMode'

const useDarkMode = () => {
  useEffect(() => {
    const isDark = prefersDarkMode()
    const htmlClasses = document.querySelector('html')?.classList
    if (isDark) htmlClasses?.add('dark')
    else htmlClasses?.remove('dark')
  }, [])
}

export default useDarkMode
