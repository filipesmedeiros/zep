import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { getAllPreferences, putPreference } from '../db/preferences'
import {
  PreferenceName,
  PreferenceTypes,
  ShowCurrencyPreference,
} from '../db/types'
import useDarkMode from '../hooks/useDarkMode'

export interface PreferenceContextValue {
  preferences: PreferenceTypes
  setPreference: <P extends PreferenceName>(
    preference: P,
    value: Exclude<PreferenceTypes[P], undefined>
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
  darkMode: true,
  biometricsAuth: true,
  leftHanded: false,
  showCurrencyDash: ShowCurrencyPreference.None,
}

export const PreferencesProvider: FC = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferenceTypes>(initialState)

  const { setDarkMode, isDarkMode } = useDarkMode()

  const setPreference = useCallback(
    <P extends PreferenceName>(
      name: P,
      value: Exclude<PreferenceTypes[P], undefined>,
      { skipIdb = false } = { skipIdb: false }
    ) => {
      setPreferences(prev => ({ ...prev, [name]: value }))
      if (!skipIdb) putPreference(name, value)

      // ? is there a better way to type this?
      if (name === 'darkMode' && isDarkMode !== value)
        setDarkMode(value as boolean)
    },
    [setDarkMode, isDarkMode]
  )

  useEffect(() => {
    setPreference('darkMode', isDarkMode)
  }, [isDarkMode, setPreference])

  useEffect(() => {
    const fetchPreferencesFromIdb = async () => {
      const preferenceList = await getAllPreferences()
      // todo i can change this to only change state once but i'm too sleepy now
      for (const preference of preferenceList) {
        // @ts-expect-error i should type this better but should be fine for now
        setPreference(preference.name, preference.value, { skipIdb: true })
      }
    }
    fetchPreferencesFromIdb()
  }, [setPreference])

  return (
    <preferencesContext.Provider value={{ preferences, setPreference }}>
      {children}
    </preferencesContext.Provider>
  )
}
