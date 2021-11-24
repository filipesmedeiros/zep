import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  prefersBiometricsAuth,
  togglePrefersBiometricsAuth,
} from '../preferences/biometricsAuth'
import { prefersDarkMode, togglePrefersDarkMode } from '../preferences/darkMode'
import {
  prefersLeftHanded,
  togglePrefersLeftHanded,
} from '../preferences/leftHanded'
import {
  ShowCurrency,
  prefersShowCurrencyDash,
  togglePrefersCurrencyDash,
} from '../preferences/showCurrencyDash'

export interface Preferences {
  darkMode: boolean | undefined
  biometricsAuth: boolean | undefined
  leftHanded: boolean | undefined
  showCurrencyDash: ShowCurrency | undefined
}

const preferencesContext = createContext<
  | {
      preferences: Preferences
      setPreference: <K extends keyof Preferences>(
        preference: K,
        value: Preferences[K]
      ) => void
      togglePreference: (preference: keyof Preferences) => void
    }
  | undefined
>(undefined)

export const usePreferences = () => {
  const preferences = useContext(preferencesContext)
  if (preferences === undefined)
    throw new Error(
      '`usePreferences` must be used insisde a context `Provider`'
    )
  return preferences
}

export const PreferencesProvider: FC = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    darkMode: undefined,
    biometricsAuth: undefined,
    leftHanded: undefined,
    showCurrencyDash: undefined,
  })
  useEffect(() => {
    setPreferences({
      darkMode: prefersDarkMode(),
      biometricsAuth: prefersBiometricsAuth(),
      leftHanded: prefersLeftHanded(),
      showCurrencyDash: prefersShowCurrencyDash(),
    })
  }, [])
  const setPreference = useCallback(
    <K extends keyof Preferences>() =>
      (preference: K, value: Preferences[K]) => {
        // todo change localStorage here
        setPreferences(prev => ({ ...prev, [preference]: value }))
      },
    []
  )

  const togglePreference = useCallback((preference: keyof Preferences) => {
    if (preference === 'darkMode') {
      togglePrefersDarkMode()
      setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }))
    } else if (preference === 'biometricsAuth') {
      togglePrefersBiometricsAuth()
      setPreferences(prev => ({
        ...prev,
        biometricsAuth: !prev.biometricsAuth,
      }))
    } else if (preference === 'leftHanded') {
      togglePrefersLeftHanded()
      setPreferences(prev => ({ ...prev, leftHanded: !prev.leftHanded }))
    } else if (preference === 'showCurrencyDash') {
      togglePrefersCurrencyDash()
      setPreferences(prev => ({
        ...prev,
        showCurrencyDash:
          prev.showCurrencyDash === ShowCurrency.Both
            ? ShowCurrency.Xno
            : prev.showCurrencyDash === ShowCurrency.Xno
            ? ShowCurrency.None
            : ShowCurrency.Both,
      }))
    }
  }, [])

  return (
    <preferencesContext.Provider
      value={{ preferences, setPreference, togglePreference }}
    >
      {children}
    </preferencesContext.Provider>
  )
}
