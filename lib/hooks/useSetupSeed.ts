import { AES } from 'crypto-js'
import { wallet } from 'nanocurrency-web'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { checkBiometrics, registerBiometrics } from '../biometrics'
import { useAccounts } from '../context/accountContext'
import { addAccount } from '../db/accounts'
import { addEncryptedSeed, hasEncryptedSeed } from '../db/encryptedSeeds'
import encryptSeed from '../encryptSeed'
import accountAtIndex from '../nano/accountAtIndex'
import fetchAccountInfo from '../nano/fetchAccountInfo'
import useSetup from './useSetup'

const useSetupSeed = (skip?: boolean) => {
  const { setAccount } = useAccounts()
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
      const { address, publicKey } = accountAtIndex(generatedSeed, 0)

      const infoRes = await fetchAccountInfo(address)

      const account = {
        frontier: 'error' in infoRes ? null : infoRes.confirmed_frontier,
        representative:
          'error' in infoRes ? null : infoRes.confirmed_representative,
        balance: '0',
        index: 0,
        address,
        publicKey,
      }
      setSeed({ seed: generatedSeed, mnemonic })
      setAccount(account)
      await addAccount(0, account)
    } catch {}
  }, [replace, setAccount])

  const storeSeed = useCallback(async () => {
    if (seed === undefined) return
    await addEncryptedSeed('os', await encryptSeed(seed.seed))
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
