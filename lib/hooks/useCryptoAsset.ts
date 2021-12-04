import { useEffect, useState } from 'react'

import { getCryptoAsset } from '../db/cryptoAssets'
import { CryptoAssetId } from '../db/types'

const useCryptoAsset = (id: CryptoAssetId) => {
  const [cryptoAsset, setCryptoAsset] = useState<Uint8Array>()

  useEffect(() => {
    const setAsset = async () =>
      setCryptoAsset((await getCryptoAsset(id))?.cryptoAsset)
    setAsset()
  }, [id])
  return cryptoAsset
}

export default useCryptoAsset
