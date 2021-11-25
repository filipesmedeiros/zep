import Dexie, { Table } from 'dexie'

export type CryptoAssetId = 'challenge' | 'credentialId'

interface CryptoAsset {
  id: CryptoAssetId
  cryptoAsset: Uint8Array
}

class CryptoAssets extends Dexie {
  public cryptoAssets!: Table<CryptoAsset, CryptoAssetId>

  public constructor() {
    super('CryptoAssets')
    this.version(1).stores({
      cryptoAssets: 'id,cryptoAsset',
    })
  }
}

const db = new CryptoAssets()

export const addCryptoAsset = (id: CryptoAssetId, cryptoAsset: Uint8Array) =>
  db.cryptoAssets.add({ id, cryptoAsset })

export const removeCryptoAsset = (id: CryptoAssetId) =>
  db.cryptoAssets.delete(id)

export const getCryptoAsset = (id: CryptoAssetId) =>
  db.cryptoAssets
    .where({ id })
    .first()
    .then(res => res?.cryptoAsset)

export const hasCryptoAsset = async (id: CryptoAssetId) =>
  (await db.cryptoAssets.where({ id }).count()) > 0

export default db
