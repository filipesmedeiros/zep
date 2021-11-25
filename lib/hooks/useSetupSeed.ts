import { AES } from 'crypto-js'
import { wallet } from 'nanocurrency-web'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { checkBiometrics, registerBiometrics } from '../biometrics'
import { useAddress } from '../context/addressContext'
import { addAddress } from '../db/addresses'
import { addEncryptedSeed, hasEncryptedSeed } from '../db/encryptedSeeds'
import addressFromSeed from '../nano/addressFromSeed'
import useSetup from './useSetup'

const useSetupSeed = (skip?: boolean) => {
  const { setAddress } = useAddress()
  const [mnemonic, setMnemonic] = useState<string | undefined>(undefined)
  const { replace } = useRouter()
  const setupSeed = useCallback(async () => {
    try {
      // todo what about the pin?
      const alreadyHasEncryptedSeed = await hasEncryptedSeed('os')
      if (alreadyHasEncryptedSeed) {
        replace('/dashboard')
        return
      }

      const [{ seed: newSeed, mnemonic }] = await Promise.all([
        wallet.generate(),
        registerBiometrics(),
      ])

      const {
        // @ts-expect-error
        response: { signature: sig },
      } = await checkBiometrics()
      const encryptedSeed = AES.encrypt(newSeed, sig.toString()).toString()
      await Promise.all([
        addEncryptedSeed('os', encryptedSeed),
        addAddress(0, addressFromSeed(newSeed, 0)),
      ])
      setAddress(addressFromSeed(newSeed, 0))
      setMnemonic(mnemonic)
    } catch {}
  }, [replace, setAddress])

  const settingUp = useSetup(setupSeed, skip)

  return {
    lazy: setupSeed,
    settingUp,
    seedIsThere: mnemonic !== undefined,
    seed: mnemonic,
  }
}

export default useSetupSeed
