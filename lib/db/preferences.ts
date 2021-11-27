import db from '.'
import { PreferenceName, PreferenceTypes, PreferenceValue } from './types'

export const addPreference = <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => db()!.add('preferences', { name, value: JSON.stringify(value) })

export const putPreference = <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => db()!.put('preferences', { name, value: JSON.stringify(value) })

export const removePreference = (name: PreferenceName) =>
  db()!.delete('preferences', name)

export const getPreference = <P extends PreferenceName>(name: P) =>
  db()!
    .get('preferences', name)
    .then(pref =>
      pref?.value === undefined
        ? undefined
        : (JSON.parse(pref.value) as PreferenceTypes[P])
    )

export const getAllPreferences = () =>
  db()!
    .getAll('preferences')
    .then(preferenceList =>
      preferenceList.map(({ name, value }) => ({
        name,
        value: JSON.parse(value) as PreferenceTypes[typeof name],
      }))
    )

export const hasPreference = async (name: PreferenceName) =>
  db()!
    .count('preferences', name)
    .then(count => count === 1)
