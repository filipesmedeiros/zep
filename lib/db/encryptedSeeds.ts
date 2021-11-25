import Dexie, { Table } from 'dexie'

export type EncryptedSeedId = 'pin' | 'os'

interface EncryptedSeed {
  id: EncryptedSeedId
  encryptedSeed: string
}

class EncryptedSeeds extends Dexie {
  public encryptedSeeds!: Table<EncryptedSeed, EncryptedSeedId>

  public constructor() {
    super('EncryptedSeeds')
    this.version(1).stores({
      encryptedSeeds: 'id,encryptedSeed',
    })
  }
}

const db = new EncryptedSeeds()

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

export default db
