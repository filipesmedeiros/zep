export const localStorageKey = 'prefers-biometrics'

export const prefersBiometricsAuth = () =>
  (localStorage.getItem(localStorageKey) ?? 'true') === 'true'

export const togglePrefersBiometricsAuth = () => {
  const prefers = prefersBiometricsAuth()
  localStorage.setItem(localStorageKey, prefers ? 'false' : 'true')
}
