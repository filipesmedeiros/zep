import { useEffect, useState } from 'react'

import openDb from '../db'
import { getCryptoAsset } from '../db/cryptoAssets'
import { CryptoAssetId } from '../db/types'

const useCryptoAsset = (id: CryptoAssetId) => {
  const [cryptoAsset, setCryptoAsset] = useState({
    cryptoAsset: undefined as Uint8Array | undefined,
    checking: true,
  })

  useEffect(() => {
    const setAsset = async () => {
      const cryptoAsset = (await getCryptoAsset(id))?.cryptoAsset
      setCryptoAsset({ cryptoAsset, checking: false })
    }
    setAsset()
  }, [id])
  return cryptoAsset
}

export default useCryptoAsset
