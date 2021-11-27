import Dexie, { Table } from 'dexie'

import type {
  AccountsKey,
  AccountsValue,
  CryptoAssetKey,
  CryptoAssetValue,
  EncryptedSeedKey,
  EncryptedSeedValue,
  PreferenceKey,
  PreferenceValue,
} from './types'
import {
  accountsSchema,
  cryptoAssetSchema,
  encryptedSeedSchema,
  preferenceSchema,
} from './types'

class Database extends Dexie {
  public encryptedSeeds!: Table<EncryptedSeedValue, EncryptedSeedKey>
  public cryptoAssets!: Table<CryptoAssetValue, CryptoAssetKey>
  public accounts!: Table<AccountsValue, AccountsKey>
  public preferences!: Table<PreferenceValue, PreferenceKey>

  public constructor() {
    super('Database')
    this.version(1).stores({
      encryptedSeeds: encryptedSeedSchema,
      cryptoAssets: cryptoAssetSchema,
      preferences: preferenceSchema,
      accounts: accountsSchema,
    })
  }
}

export default Database
