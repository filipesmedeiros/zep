import Dexie, { Table } from 'dexie'

export enum EncryptedSeedId {
  Pin = 'pin',
  Os = 'os',
}

interface EncryptedSeed {
  id: EncryptedSeedId
  encryptedSeed: Uint8Array
}

class KeyStore extends Dexie {
  public encryptedSeeds!: Table<EncryptedSeed, EncryptedSeedId>

  public constructor() {
    super('EncryptedSeeds')
    this.version(1).stores({
      encryptedSeeds: 'id,encryptedSeed',
    })
  }
}

export const db = new KeyStore()

export const addEncryptedSeed = (
  id: EncryptedSeedId,
  encryptedSeed: Uint8Array
) => db.encryptedSeeds.add({ id, encryptedSeed })

export const removeEncryptedSeed = (id: EncryptedSeedId) =>
  db.encryptedSeeds.delete(id)

export const getEncryptedSeed = (id: EncryptedSeedId) =>
  db.encryptedSeeds.where({ id }).first()

export const hasEncryptedSeed = async (id: EncryptedSeedId) =>
  (await db.encryptedSeeds.where({ id }).count()) > 0
