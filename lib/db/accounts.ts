import db from '.'
import { AccountInfoCache } from '../types'

export const addAccount = async (index: number, account: AccountInfoCache) =>
  (await db())!.add('accounts', {
    ...account,
    index,
    precomputedWork: null,
  })

export const putAccount = async (account: AccountInfoCache) =>
  (await db())!.put('accounts', account)

export const removeAccount = async (index: number) =>
  (await db())!.delete('accounts', index)

export const removeAllAccounts = async () =>
  (await db())!.delete('accounts', IDBKeyRange.lowerBound(0))

export const getAccount = async (index: number) =>
  (await db())!.get('accounts', index)

export const getAllAccounts = async () => (await db())!.getAll('accounts')

export const hasAccount = async (index: number) =>
  (await db())!.count('accounts', index).then(count => count === 1)

export const addPrecomputedWork = async (address: string, work: string) => {
  const tx = (await db())!.transaction('accounts', 'readwrite')
  const account = await tx.store.index('address').get(address)
  if (account !== undefined && work !== account.precomputedWork) {
    tx.store.put({ ...account, precomputedWork: work })
  }
  return tx.done
}

export const getPrecomputedWork = async (address: string) =>
  (await db())!.getFromIndex('accounts', 'address', address).then(account => {
    if (account === undefined) throw new Error('not_found')
    return account.precomputedWork
  })

export const consumePrecomputedWork = async (address: string) => {
  const tx = (await db())!.transaction('accounts', 'readwrite')
  const account = await tx.store.index('address').get(address)
  if (account !== undefined && account.precomputedWork !== null) {
    tx.store.put({ ...account, precomputedWork: null })
  }
  return tx.done
}
