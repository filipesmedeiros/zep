import { wallet } from 'nanocurrency-web'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import { registerBiometrics } from '../../lib/biometrics'
import computeWorkAsync from '../../lib/computeWorkAsync'
import { useAccounts } from '../../lib/context/accountContext'
import { addAccount, addPrecomputedWork } from '../../lib/db/accounts'
import { addEncryptedSeed } from '../../lib/db/encryptedSeeds'
import encryptSeed from '../../lib/encryptSeed'
import useChallenge from '../../lib/hooks/useChallenge'
import showNotification from '../../lib/showNotification'
import { AccountInfoCache } from '../../lib/types'
import accountAtIndex from '../../lib/xno/accountAtIndex'

const New: NextPage = () => {
  const { setAccount } = useAccounts()

  const seedRef = useRef(wallet.generateLegacy())
  useEffect(() => {}, [])

  const { challenge } = useChallenge()
  const [credentialId, setCredentialId] = useState<Uint8Array>()

  const onGenerateSeed = async () => {
    const [newCredentialId] = await Promise.all([
      registerBiometrics(challenge!),
      navigator.clipboard.writeText(seedRef.current.mnemonic),
    ])

    showNotification({
      title: 'seed copied to clipboard',
      body: 'you just copied your seed to your clipboard, you can use it anywhere',
      tag: 'copy-seed',
    })

    const { address, publicKey } = accountAtIndex(seedRef.current.seed, 0)

    const account: AccountInfoCache = {
      frontier: null,
      representative: address,
      balance: '0',
      index: 0,
      address,
      publicKey,
      precomputedWork: null,
    }
    setAccount(account)
    addAccount(0, account)

    computeWorkAsync(publicKey, { send: false }).then(work => {
      if (work !== null) {
        setAccount({ ...account, precomputedWork: work })
        addPrecomputedWork(address, work)
      }
    })
    setCredentialId(newCredentialId)
  }

  const onStoreSeed = async (credentialId: Uint8Array) => {
    const encryptedSeed = await encryptSeed({
      seed: seedRef.current.seed,
      challenge: challenge!,
      rawId: credentialId,
    })
    await addEncryptedSeed('os', encryptedSeed)

    window.location.href = '/welcome/done'
  }

  const isRegisterStep = credentialId === undefined

  return (
    <>
      <Head>
        <title>zep⚡️ - welcome</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-2 xs:gap-6 text-gray-900 dark:text-primary-50 transition-colors">
        <header>
          <h1 className="font-extrabold text-7xl xs:text-8xl">
            {isRegisterStep ? 1 : 2}
          </h1>
          <h2 className="font-extrabold text-2xl xs:text-4xl">
            {isRegisterStep ? 'generate passphrase' : 'store passphrase'}
          </h2>
          <h3 className="text-lg">
            {isRegisterStep
              ? 'and copy it to your clipboard'
              : 'securely inside zep'}
          </h3>
        </header>
        <button
          className="px-5 py-1 xs:py-2 text-lg xs:text-xl font-bold bg-primary-400 transition-colors text-primary-50 rounded dark:bg-gray-800"
          onClick={
            isRegisterStep ? onGenerateSeed : () => onStoreSeed(credentialId)
          }
        >
          {isRegisterStep ? 'generate' : 'store'} passphrase
        </button>
        <p className="text-xs xs:text-base sm:text-xl">
          {isRegisterStep ? (
            <b>
              store this passphrase securely (e.g. on paper): you&apos;ll need
              it in case something happens to this device
            </b>
          ) : (
            <em>
              reminder: your passphrase will{' '}
              <b className="font-extrabold">never</b> leave zep or your device
            </em>
          )}
        </p>
      </div>
    </>
  )
}

export default New
