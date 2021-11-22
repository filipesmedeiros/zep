import Dexie, { Table } from 'dexie'

interface Key {
  id: string
  key: Uint8Array
}

//
// Declare Database
//
class KeyStore extends Dexie {
  public keys!: Table<Key, string> // id is number in this case

  public constructor() {
    super('KeyStore')
    this.version(1).stores({
      keys: 'id,key',
    })
  }
}

export const db = new KeyStore()

export const addKey = (key: Uint8Array) => db.keys.add({ id: 'key', key })

export const removeKey = () => db.keys.delete('key')

export const getKey = () => db.keys.where({ id: 'key' }).first()

export const hasKey = async () =>
  (await db.keys.where({ id: 'key' }).count()) > 0
