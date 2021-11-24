import Dexie, { Table } from 'dexie'

interface Address {
  index: number
  address: string
}

class Addresses extends Dexie {
  public addresses!: Table<Address, number>

  public constructor() {
    super('Addresses')
    this.version(1).stores({
      addresses: 'index,address',
    })
  }
}

export const db = new Addresses()

export const addAddress = (index: number, address: string) =>
  db.addresses.add({ address, index })

export const removeAddress = (index: number) => db.addresses.delete(index)

export const getAddress = (index: number) =>
  db.addresses.where({ index }).first()

export const hasAddress = async (index: number) =>
  (await db.addresses.where({ index }).count()) > 0
