import Dexie, { Table } from 'dexie'

import { AccountInfoCache } from '../types'

interface Account extends AccountInfoCache {
  index: number
}

class Accounts extends Dexie {
  public accounts!: Table<Account, number>

  public constructor() {
    super('Accounts')
    this.version(1).stores({
      accounts: 'index,account',
    })
  }
}

const db = new Accounts()

export const addAccount = (index: number, account: AccountInfoCache) =>
  db.accounts.add({ ...account, index })

export const putAccount = (index: number, account: AccountInfoCache) =>
  db.accounts.put({ ...account, index })

export const removeAccount = (index: number) => db.accounts.delete(index)

export const getAccount = (index: number) =>
  db.accounts
    .where({ index })
    .first()
    .then(res => (res === undefined ? undefined : res))

export const hasAccount = async (index: number) =>
  (await db.accounts.where({ index }).count()) > 0

export default db
