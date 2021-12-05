import db from '.'
import { EncryptedSeedId } from './types'

export const addEncryptedSeed = async (
  id: EncryptedSeedId,
  encryptedSeed: string
) => (await db())!.add('encryptedSeeds', { id, encryptedSeed })

export const removeEncryptedSeed = async (id: EncryptedSeedId) =>
  (await db())!.delete('encryptedSeeds', id)

export const getEncryptedSeed = async (id: EncryptedSeedId) =>
  (await db())!.get('encryptedSeeds', id)

export const hasEncryptedSeed = async (id: EncryptedSeedId) =>
  (await db())!.count('encryptedSeeds', id).then(count => count === 1)
