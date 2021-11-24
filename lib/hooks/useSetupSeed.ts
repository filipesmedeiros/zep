import { AES } from 'crypto-js'
import { generateSeed } from 'nanocurrency'
import { useCallback } from 'react'

import { checkBiometrics } from '../biometrics'
import { addAddress } from '../db/addresses'
import { addEncryptedSeed } from '../db/encryptedSeeds'
import addressFromSeed from '../nano/addressFromSeed'
import useSetup from './useSetup'

const useSetupSeed = (skip?: boolean) =>
  useSetup(
    useCallback(async () => {
      const [
        newSeed,
        {
          // @ts-expect-error
          response: { signature: sig },
        },
      ] = await Promise.all([generateSeed(), checkBiometrics()])
      const encryptedSeed = AES.encrypt(newSeed, sig.toString()).toString()
      await Promise.all([
        addEncryptedSeed('os', encryptedSeed),
        addAddress(0, addressFromSeed(newSeed, 0)),
      ])
    }, []),
    skip
  )

export default useSetupSeed
