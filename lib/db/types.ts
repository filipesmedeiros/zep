import { AccountInfoCache } from '../types'

export type EncryptedSeedId = 'pin' | 'os'

interface EncryptedSeed {
  id: EncryptedSeedId
  encryptedSeed: string
}

export type EncryptedSeedKey = EncryptedSeedId
export type EncryptedSeedValue = EncryptedSeed

export const encryptedSeedSchema = 'id'

interface Account extends AccountInfoCache {
  index: number
  precomputedWork: string | null
}

export type AccountsKey = number
export type AccountsValue = Account
export const accountsSchema = 'index,address'

export type CryptoAssetId = 'challenge' | 'credentialId'

interface CryptoAsset {
  id: CryptoAssetId
  cryptoAsset: Uint8Array
}

export type CryptoAssetKey = CryptoAssetId
export type CryptoAssetValue = CryptoAsset

export const cryptoAssetSchema = 'id'

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

export type PreferenceKey = PreferenceName
export type PreferenceValue = Preference

export const preferenceSchema = 'name'
