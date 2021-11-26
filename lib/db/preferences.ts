import Dexie, { Table } from 'dexie'

import db from '.'

export enum ShowCurrencyPreference {
  Xno = 'xno',
  Both = 'both',
  None = 'none',
}

export interface PreferenceTypes {
  darkMode: boolean | undefined
  biometricsAuth: boolean | undefined
  leftHanded: boolean | undefined
  showCurrencyDash: ShowCurrencyPreference | undefined
}

export type PreferenceName = keyof PreferenceTypes

interface Preference {
  name: PreferenceName
  value: string
}

export type Key = PreferenceName
export type Value = Preference

export const schema = 'name,value'

export const addPreference = <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => db.preferences.add({ name, value: JSON.stringify(value) })

export const putPreference = <P extends PreferenceName>(
  name: P,
  value: PreferenceTypes[P]
) => db.preferences.put({ name, value: JSON.stringify(value) })

export const removePreference = (name: PreferenceName) =>
  db.preferences.delete(name)

export const getPreference = <P extends PreferenceName>(
  name: P
): Promise<PreferenceTypes[P]> =>
  db.preferences
    .where({ name })
    .first()
    .then(pref =>
      pref?.value === undefined ? undefined : JSON.parse(pref.value)
    )

export const hasPreference = async (name: PreferenceName) =>
  (await db.preferences.where({ name }).count()) > 0
