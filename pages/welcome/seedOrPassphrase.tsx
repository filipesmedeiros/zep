import { wallet } from 'nanocurrency-web'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import SeedInput from '../../components/SeedInput'
import { registerBiometrics } from '../../lib/biometrics'
import computeWorkAsync from '../../lib/computeWorkAsync'
import { useAccounts } from '../../lib/context/accountContext'
import { addAccount, addPrecomputedWork } from '../../lib/db/accounts'
import { addEncryptedSeed } from '../../lib/db/encryptedSeeds'
import encryptSeed from '../../lib/encryptSeed'
import { AccountInfoCache } from '../../lib/types'
import accountAtIndex from '../../lib/xno/accountAtIndex'
import fetchAccountInfo from '../../lib/xno/fetchAccountInfo'

const SeedOrPassphrase: NextPage = () => {
  const { push } = useRouter()
  const [isPassphrase, setIsPassphrase] = useState(true)
  const { setAccount } = useAccounts()

  const [inputValue, setInputValue] = useState('')
  const [registering, setRegistering] = useState(true)

  const onRegisterClick = async () => {
    // todo check seed
    await registerBiometrics()
    setRegistering(false)
  }

  const onStoreClick = async () => {
    const inputSeed = isPassphrase
      ? wallet.fromMnemonic(inputValue).seed
      : inputValue
    await addEncryptedSeed('os', await encryptSeed(inputSeed))

    const { address, publicKey } = accountAtIndex(inputSeed, 0)

    const account: AccountInfoCache = {
      frontier: null,
      representative: address,
      balance: '0',
      index: 0,
      address,
      publicKey,
      precomputedWork: null,
    }

    const infoResponse = await fetchAccountInfo(account.address)

    const frontier =
      'error' in infoResponse ? null : infoResponse.confirmed_frontier
    const representative =
      'error' in infoResponse ? address : infoResponse.confirmed_representative
    const balance =
      'error' in infoResponse ? '0' : infoResponse.confirmed_balance
    const accountInfo: AccountInfoCache = {
      ...account,
      frontier,
      representative,
      balance,
    }

    setAccount(accountInfo)
    addAccount(0, accountInfo)

    computeWorkAsync(publicKey, { send: false }).then(work => {
      if (work !== null) {
        setAccount({ ...accountInfo, precomputedWork: work })
        addPrecomputedWork(address, work)
      }
    })

    push('/welcome/done')
  }

  const seedInputRef = useRef<HTMLInputElement>(null)
  const firstPassphraseInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isPassphrase) firstPassphraseInputRef.current?.focus()
    else seedInputRef.current?.focus()
  }, [isPassphrase])

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-2 text-gray-900 dark:text-purple-50 transition-colors">
      <h1 className="font-extrabold text-3xl">input your secret</h1>
      {registering ? (
        <>
          <button
            className="px-5 py-2 text-xl font-bold bg-purple-400 transition-colors text-purple-50 rounded dark:bg-gray-800"
            onClick={onRegisterClick}
          >
            register biometrics
          </button>
        </>
      ) : (
        <>
          <p className="text-lg">
            store the <b>secret</b> securely in zep
          </p>
          <div className="flex gap-2">
            <button
              className="px-5 py-2 text-xl font-bold bg-purple-400 transition-colors text-purple-50 rounded dark:bg-gray-800"
              onClick={() => setIsPassphrase(true)}
            >
              passphrase
            </button>
            <button
              className="px-5 py-2 text-xl font-bold bg-purple-400 transition-colors text-purple-50 rounded dark:bg-gray-800"
              onClick={() => setIsPassphrase(false)}
            >
              seed
            </button>
          </div>
          {!isPassphrase ? (
            <SeedInput
              ref={seedInputRef}
              value={inputValue}
              onChange={setInputValue}
            />
          ) : null}
          <button
            className="px-5 py-2 text-xl font-bold bg-purple-400 transition-all text-purple-50 rounded dark:bg-gray-800 disabled:cursor-default disabled:opacity-60"
            disabled={inputValue === ''}
            onClick={onStoreClick}
          >
            store passphrase
          </button>
          <aside className="text-xs">
            again, your passphrase will{' '}
            <b className="font-extrabold">
              <em>never</em>
            </b>{' '}
            leave your device, and will only be decrypted for a brief moment on
            each transaction
          </aside>
        </>
      )}
    </div>
  )
}

export default SeedOrPassphrase
