import db from '.'
import { CryptoAssetId } from './types'

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
