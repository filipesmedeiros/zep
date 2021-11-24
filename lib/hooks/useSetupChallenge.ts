import { useCallback } from 'react'

import { addCryptoAsset, hasCryptoAsset } from '../db/cryptoAssets'
import useSetup from './useSetup'

const useSetupChallenge = (skip?: boolean) =>
  useSetup(
    useCallback(async () => {
      const alreadyHasChallenge = await hasCryptoAsset('challenge')
      if (!alreadyHasChallenge) {
        const randomBytes = new Uint8Array(32)
        crypto.getRandomValues(randomBytes)
        addCryptoAsset('challenge', randomBytes)
      }
    }, []),
    skip
  )

export default useSetupChallenge
