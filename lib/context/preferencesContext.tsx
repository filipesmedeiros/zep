import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getPreference, putPreference } from '../db/preferences'
import {
  PreferenceName,
  PreferenceTypes,
  ShowCurrencyPreference,
} from '../db/types'
import useDarkMode from '../hooks/useDarkMode'
import isiOS from '../isiOS'

const preferencesContext = createContext<
  | {
      preferences: PreferenceTypes
      setPreference: <P extends PreferenceName>(
        preference: P,
        value: PreferenceTypes[P]
      ) => void
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
  const [preferences, setPreferences] = useState<PreferenceTypes>({
    darkMode: undefined,
    biometricsAuth: undefined,
    leftHanded: undefined,
    showCurrencyDash: undefined,
  })
  useEffect(() => {
    const setPrefs = async () => {
      const [darkMode, biometricsAuth, leftHanded, showCurrencyDash] =
        await Promise.all([
          getPreference('darkMode'),
          getPreference('biometricsAuth'),
          getPreference('leftHanded'),
          getPreference('showCurrencyDash'),
        ])
      setPreferences({
        darkMode: darkMode ?? true,
        biometricsAuth: biometricsAuth ?? !isiOS(),
        leftHanded: leftHanded ?? false,
        showCurrencyDash: showCurrencyDash ?? ShowCurrencyPreference.Xno,
      })
    }
    setPrefs()
  }, [])
  useDarkMode(preferences.darkMode)
  const setPreference = useCallback(
    <P extends PreferenceName>(name: P, value: PreferenceTypes[P]) => {
      setPreferences(prev => ({ ...prev, [name]: value }))
      putPreference(name, value)
    },
    []
  )

  return (
    <preferencesContext.Provider value={{ preferences, setPreference }}>
      {children}
    </preferencesContext.Provider>
  )
}
