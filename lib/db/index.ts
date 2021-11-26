import Dexie, { Table } from 'dexie'

import {
  Key as AccountsKey,
  Value as AccountsValue,
  schema as accountsSchema,
} from './accounts'
import {
  Key as CryptoAssetsKey,
  Value as CryptoAssetsValue,
  schema as cryptoAssetsSchema,
} from './cryptoAssets'
import {
  Key as EncryptedSeedsKey,
  Value as EncryptedSeedsValue,
  schema as encryptedSeedsSchema,
} from './encryptedSeeds'
import {
  Key as PreferencesKey,
  Value as PreferencesValue,
  schema as preferencesSchema,
} from './preferences'

class Database extends Dexie {
  public encryptedSeeds!: Table<EncryptedSeedsValue, EncryptedSeedsKey>
  public cryptoAssets!: Table<CryptoAssetsValue, CryptoAssetsKey>
  public accounts!: Table<AccountsValue, AccountsKey>
  public preferences!: Table<PreferencesValue, PreferencesKey>

  public constructor() {
    super('Database')
    this.version(1).stores({
      encryptedSeeds: encryptedSeedsSchema,
      cryptoAssets: cryptoAssetsSchema,
      preferences: preferencesSchema,
      accounts: accountsSchema,
    })
  }
}

const db = new Database()

export default db
