import { AES } from 'crypto-js'
import { wallet } from 'nanocurrency-web'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { checkBiometrics, registerBiometrics } from '../biometrics'
import { useAddress } from '../context/addressContext'
import { addAccount } from '../db/accounts'
import { addEncryptedSeed, hasEncryptedSeed } from '../db/encryptedSeeds'
import addressFromSeed from '../nano/addressFromSeed'
import useSetup from './useSetup'

const useSetupSeed = (skip?: boolean) => {
  const { setAddress } = useAddress()
  const [seed, setSeed] = useState<
    { seed: string; mnemonic: string } | undefined
  >(undefined)
  const { replace } = useRouter()
  const setupSeed = useCallback(async () => {
    try {
      // todo what about the pin?
      const alreadyHasEncryptedSeed = await hasEncryptedSeed('os')
      if (alreadyHasEncryptedSeed) {
        replace('/dashboard')
        return
      }

      const [{ seed: generatedSeed, mnemonic }] = await Promise.all([
        wallet.generate(),
        registerBiometrics(),
      ])
      setSeed({ seed: generatedSeed, mnemonic })
      setAddress(addressFromSeed(generatedSeed, 0))
      await addAccount(0, addressFromSeed(generatedSeed, 0))
    } catch {}
  }, [replace, setAddress])

  const storeSeed = useCallback(async () => {
    if (seed === undefined) return
    const {
      // @ts-expect-error
      response: { signature: sig },
    } = await checkBiometrics()
    const encryptedSeed = AES.encrypt(seed.seed, sig.toString()).toString()
    await addEncryptedSeed('os', encryptedSeed)
  }, [seed])

  const { settingUp, lazy } = useSetup(setupSeed, skip)

  return {
    lazy,
    storeSeed,
    settingUp,
    seedIsThere: seed !== undefined,
    seed: seed,
  }
}

export default useSetupSeed
