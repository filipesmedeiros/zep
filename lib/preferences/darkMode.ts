export const localStorageKey = 'prefers-darkMode'

export const prefersDarkMode = () =>
  localStorage.getItem(localStorageKey) === 'true'

export const togglePrefersDarkMode = () => {
  const prefers = prefersDarkMode()
  const htmlClasses = document.querySelector('html')?.classList
  if (!prefers) htmlClasses?.add('dark')
  else htmlClasses?.remove('dark')
  localStorage.setItem(localStorageKey, (!prefers).toString())
}
