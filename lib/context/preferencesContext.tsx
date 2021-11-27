import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getAllPreferences, putPreference } from '../db/preferences'
import { PreferenceName, PreferenceTypes } from '../db/types'
import useDarkMode from '../hooks/useDarkMode'

export interface PreferenceContextValue {
  preferences: PreferenceTypes
  setPreference: <P extends PreferenceName>(
    preference: P,
    value: PreferenceTypes[P]
  ) => void
}

const preferencesContext = createContext<PreferenceContextValue | undefined>(
  undefined
)

export const usePreferences = () => {
  const preferences = useContext(preferencesContext)
  if (preferences === undefined)
    throw new Error(
      '`usePreferences` must be used insisde a context `Provider`'
    )
  return preferences
}

const initialState: PreferenceContextValue['preferences'] = {
  darkMode: undefined,
  biometricsAuth: undefined,
  leftHanded: undefined,
  showCurrencyDash: undefined,
}

export const PreferencesProvider: FC = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferenceTypes>(initialState)
  useEffect(() => {
    const fetchPreferencesFromIdb = async () => {
      const preferenceList = await getAllPreferences()
      const preferences: PreferenceContextValue['preferences'] = initialState
      for (const preference of preferenceList) {
        // @ts-expect-error i should type this better but should be fine for now
        preferences[preference.name] = preference.value
      }
      setPreferences(preferences)
    }
    fetchPreferencesFromIdb()
  }, [])
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
