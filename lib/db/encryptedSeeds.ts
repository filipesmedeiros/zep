import db from '.'
import { EncryptedSeedId } from './types'

export const addEncryptedSeed = (id: EncryptedSeedId, encryptedSeed: string) =>
  db()!.add('encryptedSeed', { id, encryptedSeed })

export const removeEncryptedSeed = (id: EncryptedSeedId) =>
  db()!.delete('encryptedSeed', id)

export const getEncryptedSeed = (id: EncryptedSeedId) =>
  db()!.get('encryptedSeed', id)

export const hasEncryptedSeed = async (id: EncryptedSeedId) =>
  db()!
    .count('encryptedSeed', id)
    .then(count => count === 1)
