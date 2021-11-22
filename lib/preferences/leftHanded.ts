export const localStorageKey = 'prefers-leftHanded'

export const prefersLeftHanded = () =>
  localStorage.getItem(localStorageKey) === 'true'

export const togglePrefersLeftHanded = () => {
  const prefers = prefersLeftHanded()
  localStorage.setItem(localStorageKey, prefers ? 'false' : 'true')
}
