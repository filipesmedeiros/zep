import { DBSchema, IDBPDatabase, openDB } from 'idb'

import type {
  AccountsKey,
  AccountsValue,
  ContactKey,
  ContactValue,
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
  encryptedSeeds: {
    key: EncryptedSeedKey
    value: EncryptedSeedValue
  }
  contacts: {
    key: ContactKey
    value: ContactValue
  }
}

let dbConnection: IDBPDatabase<Schema> | undefined = undefined

export const openDb = async (version = 1) => {
  if (dbConnection !== undefined) return dbConnection

  return (dbConnection = await openDB<Schema>('Database', version, {
    upgrade: db => {
      db.createObjectStore('accounts', {
        keyPath: 'index',
        autoIncrement: true,
      }).createIndex('address', 'address')
      db.createObjectStore('cryptoAssets', {
        keyPath: 'id',
        autoIncrement: true,
      })
      db.createObjectStore('encryptedSeeds', {
        keyPath: 'id',
        autoIncrement: true,
      })
      db.createObjectStore('preferences', {
        keyPath: 'name',
        autoIncrement: true,
      })
      db.createObjectStore('contacts', {
        keyPath: 'name',
        autoIncrement: true,
      })
    },
  }))
}

export default openDb
