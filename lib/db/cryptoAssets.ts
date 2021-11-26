import Dexie, { Table } from 'dexie'

import db from '.'

export type CryptoAssetId = 'challenge' | 'credentialId'

interface CryptoAsset {
  id: CryptoAssetId
  cryptoAsset: Uint8Array
}

export type Key = CryptoAssetId
export type Value = CryptoAsset

export const schema = 'id,cryptoAsset'

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
