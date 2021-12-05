import db from '.'
import { PreferenceName, PreferenceTypes, PreferenceValue } from './types'

export const addPreference = async <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => (await db())!.add('preferences', { name, value: JSON.stringify(value) })

export const putPreference = async <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => (await db())!.put('preferences', { name, value: JSON.stringify(value) })

export const removePreference = async (name: PreferenceName) =>
  (await db())!.delete('preferences', name)

export const getPreference = async <P extends PreferenceName>(name: P) =>
  (await db())!
    .get('preferences', name)
    .then(pref =>
      pref?.value === undefined
        ? undefined
        : (JSON.parse(pref.value) as PreferenceTypes[P])
    )

export const getAllPreferences = async () =>
  (await db())!.getAll('preferences').then(preferenceList =>
    preferenceList.map(({ name, value }) => ({
      name,
      value: JSON.parse(value) as PreferenceTypes[typeof name],
    }))
  )

export const hasPreference = async (name: PreferenceName) =>
  (await db())!.count('preferences', name).then(count => count === 1)
