import db from '.'
import { CryptoAssetId } from './types'

export const addCryptoAsset = async (
  id: CryptoAssetId,
  cryptoAsset: Uint8Array
) => (await db())!.add('cryptoAssets', { id, cryptoAsset })

export const removeCryptoAsset = async (id: CryptoAssetId) =>
  (await db())!.delete('cryptoAssets', id)

export const getCryptoAsset = async (id: CryptoAssetId) =>
  (await db())!.get('cryptoAssets', id)

export const hasCryptoAsset = async (id: CryptoAssetId) =>
  (await db())!.count('cryptoAssets', id).then(count => count === 1)
