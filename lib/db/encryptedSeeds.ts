import Dexie, { Table } from 'dexie'

import db from '.'

export type EncryptedSeedId = 'pin' | 'os'

interface EncryptedSeed {
  id: EncryptedSeedId
  encryptedSeed: string
}

export type Key = EncryptedSeedId
export type Value = EncryptedSeed

export const schema = 'id,encryptedSeed'

export const addEncryptedSeed = (id: EncryptedSeedId, encryptedSeed: string) =>
  db.encryptedSeeds.add({ id, encryptedSeed })

export const removeEncryptedSeed = (id: EncryptedSeedId) =>
  db.encryptedSeeds.delete(id)

export const getEncryptedSeed = (id: EncryptedSeedId) =>
  db.encryptedSeeds
    .where({ id })
    .first()
    .then(res => res?.encryptedSeed)

export const hasEncryptedSeed = async (id: EncryptedSeedId) =>
  (await db.encryptedSeeds.where({ id }).count()) > 0
