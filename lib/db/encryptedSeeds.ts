import db from '.'
import { EncryptedSeedId } from './types'

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
