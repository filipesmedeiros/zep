import Dexie, { Table } from 'dexie'

import db from '.'
import { AccountInfoCache } from '../types'

interface Account {
  index: number
  account: AccountInfoCache
}

export type Key = number
export type Value = Account

export const schema = 'index,account'

export const addAccount = (index: number, account: AccountInfoCache) =>
  db.accounts.add({ account, index })

export const putAccount = (index: number, account: AccountInfoCache) =>
  db.accounts.put({ account, index })

export const removeAccount = (index: number) => db.accounts.delete(index)

export const getAccount = (index: number) =>
  db.accounts
    .where({ index })
    .first()
    .then(res => (res === undefined ? undefined : res.account))

export const hasAccount = async (index: number) =>
  (await db.accounts.where({ index }).count()) > 0
