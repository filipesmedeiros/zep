import db from '.'
import computeWorkAsync from '../computeWorkAsync'
import { AccountInfoCache } from '../types'

export const addAccount = async (index: number, account: AccountInfoCache) => {
  db.accounts.add({
    ...account,
    index,
    precomputedWork: null,
  })
  const precomputedWork = await computeWorkAsync(
    account.frontier ?? account.publicKey
  )
  const hasWork = precomputedWork !== null
  if (hasWork)
    db.accounts.where({ index }).modify(account => {
      if (account !== undefined) account.precomputedWork = precomputedWork
    })
}

export const putAccount = (index: number, account: AccountInfoCache) =>
  db.accounts.update(index, { ...account })

export const removeAccount = (index: number) => db.accounts.delete(index)

export const getAccount = (index: number) =>
  db.accounts
    .where({ index })
    .first()
    .then(res => (res === undefined ? undefined : res))

export const hasAccount = async (index: number) =>
  (await db.accounts.where({ index }).count()) > 0

export const addPrecomputedWork = async (
  address: string,
  work?: string | null
) =>
  db.accounts.where({ address }).modify(async account => {
    if (work !== undefined && work !== null) account.precomputedWork = work
    else {
      const precomputedWork = await computeWorkAsync(
        account.frontier ?? account.publicKey
      )
      if (precomputedWork !== null) account.precomputedWork = precomputedWork
    }
  })

export const getPrecomputedWork = async (address: string) =>
  db.accounts
    .where({ address })
    .first()
    .then(account => account?.precomputedWork)

export const consumePrecomputedWork = async (address: string) => {
  const account = await db.accounts.where({ address }).first()
  if (account === undefined) return undefined
  db.accounts.where({ address }).modify(account => {
    account.precomputedWork = null
  })
  const precomputedWork = await computeWorkAsync(
    account.frontier ?? account.publicKey
  )
  addPrecomputedWork(address, precomputedWork)
}
