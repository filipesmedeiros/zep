import db from '.'
import { EncryptedSeedId } from './types'

export const addEncryptedSeed = (id: EncryptedSeedId, encryptedSeed: string) =>
  db()!.add('encryptedSeeds', { id, encryptedSeed })

export const removeEncryptedSeed = (id: EncryptedSeedId) =>
  db()!.delete('encryptedSeeds', id)

export const getEncryptedSeed = (id: EncryptedSeedId) =>
  db()!.get('encryptedSeeds', id)

export const hasEncryptedSeed = async (id: EncryptedSeedId) =>
  db()!
    .count('encryptedSeeds', id)
    .then(count => count === 1)
