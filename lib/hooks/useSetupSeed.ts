import { wallet } from 'nanocurrency-web'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

import { registerBiometrics } from '../biometrics'
import computeWorkAsync from '../computeWorkAsync'
import { useAccounts } from '../context/accountContext'
import { addAccount, addPrecomputedWork } from '../db/accounts'
import { addEncryptedSeed, hasEncryptedSeed } from '../db/encryptedSeeds'
import encryptSeed from '../encryptSeed'
import { AccountInfoCache } from '../types'
import accountAtIndex from '../xno/accountAtIndex'
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
        wallet.generateLegacy(),
        registerBiometrics(),
      ])
      const { address, publicKey } = accountAtIndex(
        generatedSeed.toLocaleUpperCase(),
        0
      )

      const account: AccountInfoCache = {
        frontier: null,
        representative: address,
        balance: '0',
        index: 0,
        address,
        publicKey,
        precomputedWork: null,
      }
      setSeed({ seed: generatedSeed.toLocaleUpperCase(), mnemonic })
      setAccount(account)
      addAccount(0, account)

      computeWorkAsync(publicKey, { send: false }).then(work => {
        if (work !== null) {
          setAccount({ ...account, precomputedWork: work })
          addPrecomputedWork(address, work)
        }
      })
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
