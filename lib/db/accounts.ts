import db from '.'
import { AccountInfoCache } from '../types'

export const addAccount = async (index: number, account: AccountInfoCache) =>
  db()!.add('accounts', {
    ...account,
    index,
    precomputedWork: null,
  })

export const putAccount = (account: AccountInfoCache) =>
  db()!.put('accounts', account)

export const removeAccount = (index: number) => db()!.delete('accounts', index)

export const getAccount = (index: number) => db()!.get('accounts', index)

export const getAllAccounts = () => db()!.getAll('accounts')

export const hasAccount = async (index: number) =>
  db()!
    .count('accounts', index)
    .then(count => count === 1)

export const addPrecomputedWork = async (address: string, work: string) => {
  const tx = db()!.transaction('accounts', 'readwrite')
  const account = await tx.store.index('address').get(address)
  if (account !== undefined && work !== account.precomputedWork) {
    tx.store.put({ ...account, precomputedWork: work })
  }
  return tx.done
}

export const getPrecomputedWork = async (address: string) =>
  db()!
    .getFromIndex('accounts', 'address', address)
    .then(account => {
      if (account === undefined) throw new Error('not_found')
      return account.precomputedWork
    })

export const consumePrecomputedWork = async (address: string) => {
  const tx = db()!.transaction('accounts', 'readwrite')
  const account = await tx.store.index('address').get(address)
  if (account !== undefined && account.precomputedWork !== null) {
    tx.store.put({ ...account, precomputedWork: null })
  }
  return tx.done
}
