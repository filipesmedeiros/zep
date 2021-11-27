import db from '.'
import { CryptoAssetId } from './types'

export const addCryptoAsset = (id: CryptoAssetId, cryptoAsset: Uint8Array) =>
  db()!.add('cryptoAssets', { id, cryptoAsset })

export const removeCryptoAsset = (id: CryptoAssetId) =>
  db()!.delete('cryptoAssets', id)

export const getCryptoAsset = (id: CryptoAssetId) =>
  db()!.get('cryptoAssets', id)

export const hasCryptoAsset = async (id: CryptoAssetId) =>
  db()!
    .count('cryptoAssets', id)
    .then(count => count === 1)
