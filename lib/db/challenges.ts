import Dexie, { Table } from 'dexie'

interface EncryptedSeed {
  id: string
  challenge: Uint8Array
}

class KeyStore extends Dexie {
  public challenges!: Table<EncryptedSeed, string>

  public constructor() {
    super('Challenges')
    this.version(1).stores({
      challenges: 'id,challenge',
    })
  }
}

export const db = new KeyStore()

export const addChallenge = (id: string, challenge: Uint8Array) =>
  db.challenges.add({ id, challenge })

export const removeChallenge = (id: string) => db.challenges.delete(id)

export const getChallenge = (id: string) => db.challenges.where({ id }).first()

export const hasChallenge = async (id: string) =>
  (await db.challenges.where({ id }).count()) > 0
