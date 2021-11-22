export enum ShowCurrency {
  Both,
  Xno,
  None,
}

export const localStorageKey = 'prefers-showCurrencyDash'

export const prefersShowCurrencyDash = () => {
  const prefers = localStorage.getItem(localStorageKey)
  if (prefers === null) {
    localStorage.setItem(localStorageKey, ShowCurrency.Both.toString())
    return ShowCurrency.Both
  } else return Number(prefers)
}

export const togglePrefersCurrencyDash = () => {
  const prefers = prefersShowCurrencyDash()
  const newPrefers =
    prefers === ShowCurrency.Both
      ? ShowCurrency.Xno
      : prefers === ShowCurrency.Xno
      ? ShowCurrency.None
      : ShowCurrency.Both
  localStorage.setItem(localStorageKey, newPrefers.toString())
}
