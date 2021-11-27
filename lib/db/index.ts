import { DBSchema, IDBPDatabase, openDB } from 'idb'

import { consumePrecomputedWork, getAllAccounts } from './accounts'
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

interface Schema extends DBSchema {
  preferences: {
    key: PreferenceKey
    value: PreferenceValue
  }
  cryptoAssets: {
    key: CryptoAssetKey
    value: CryptoAssetValue
  }
  accounts: {
    key: AccountsKey
    value: AccountsValue
    indexes: {
      address: string
    }
  }
  encryptedSeed: {
    key: EncryptedSeedKey
    value: EncryptedSeedValue
  }
}

let dbConnection: IDBPDatabase<Schema> | undefined = undefined

export const openDb = async (version = 1) => {
  if (dbConnection !== undefined) return
  else {
    dbConnection = await openDB<Schema>('Database', version, {
      upgrade: db => {
        db.createObjectStore('accounts').createIndex('address', 'address')
        db.createObjectStore('cryptoAssets')
        db.createObjectStore('encryptedSeed')
        db.createObjectStore('preferences')
      },
    })
  }
}

const getDb = () => dbConnection

export default getDb
