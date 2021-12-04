import clsx from 'clsx'
import { wallet } from 'nanocurrency-web'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import MnemonicInput from '../../components/MnemonicInput'
import SeedInput from '../../components/SeedInput'
import { registerBiometrics } from '../../lib/biometrics'
import computeWorkAsync from '../../lib/computeWorkAsync'
import { useAccounts } from '../../lib/context/accountContext'
import { addAccount, addPrecomputedWork } from '../../lib/db/accounts'
import { hasCryptoAsset } from '../../lib/db/cryptoAssets'
import { addEncryptedSeed } from '../../lib/db/encryptedSeeds'
import encryptSeed from '../../lib/encryptSeed'
import { AccountInfoCache } from '../../lib/types'
import accountAtIndex from '../../lib/xno/accountAtIndex'
import fetchAccountInfo from '../../lib/xno/fetchAccountInfo'

// todo organize this component
// and make it so that pressing "space" will change passphrase word inputs
const SeedOrPassphrase: NextPage = () => {
  const { push } = useRouter()
  const [isPassphrase, setIsPassphrase] = useState(true)
  const { setAccount } = useAccounts()

  const [seedInput, setSeedInput] = useState('')
  const [registering, setRegistering] = useState(true)

  useEffect(() => {
    const checkCredential = async () => {
      if (await hasCryptoAsset('credentialId')) setRegistering(false)
    }
    checkCredential()
  }, [])

  const onRegisterClick = async () => {
    // todo check seed
    await registerBiometrics()
    setRegistering(false)
  }

  const onStoreClick = async () => {
    const inputSeed = isPassphrase
      ? wallet.fromLegacyMnemonic(passphraseInputs.join(' ')).seed
      : seedInput
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

  const [passphraseInputs, setpassphraseInputs] = useState<string[]>([])
  const onPaste = (passphrase: string) => {
    const words = passphrase.split(' ')
    setpassphraseInputs(words)
  }

  return (
    <>
      <Head>
        <title>zep⚡️ - welcome</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-6 text-gray-900 dark:text-purple-50 transition-colors">
        {registering ? (
          <>
            <h1 className="font-extrabold text-3xl">
              register your biometrics
            </h1>
            <button
              aria-label="Register biometrics"
              className="px-5 py-2 text-xl font-bold bg-purple-400 transition-colors text-purple-50 rounded dark:bg-gray-800"
              onClick={onRegisterClick}
            >
              register biometrics
            </button>
            <p>
              <em>this will be used to encrypt your seed inside your device</em>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-extrabold text-3xl">input your secret</h1>
            <p className="text-lg">
              store the <b>secret</b> securely in zep
            </p>
            <div className="flex gap-4">
              <button
                aria-label="Use passphrase"
                className={clsx(
                  'px-4 py-1 text-lg font-bold bg-purple-400 transition-all text-purple-50 rounded dark:bg-gray-800',
                  isPassphrase ? 'scale-110' : 'opacity-80'
                )}
                onClick={() => setIsPassphrase(true)}
              >
                passphrase
              </button>
              <button
                aria-label="Use seed"
                className={clsx(
                  'px-4 py-1 text-lg font-bold bg-purple-400 transition-all text-purple-50 rounded dark:bg-gray-800',
                  !isPassphrase ? 'scale-110' : 'opacity-80'
                )}
                onClick={() => setIsPassphrase(false)}
              >
                seed
              </button>
            </div>
            {!isPassphrase ? (
              <SeedInput value={seedInput} onChange={setSeedInput} />
            ) : (
              <ol className="flex w-full gap-2 overflow-x-auto">
                <li className="min-w-[150px]">
                  <MnemonicInput
                    onPaste={onPaste}
                    number={1}
                    value={passphraseInputs[0] ?? ''}
                    onChange={value => {
                      console.log(value)
                      if (value.split(' ').length !== 24)
                        setpassphraseInputs(prev => {
                          const newInputs = [...prev]
                          newInputs[0] = value
                          return newInputs
                        })
                    }}
                  />
                </li>
                {new Array(24).fill(0, 0, 23).map((_, idx) => (
                  <li key={idx} className="min-w-[150px]">
                    <MnemonicInput
                      onPaste={onPaste}
                      number={idx + 2}
                      value={passphraseInputs[idx] ?? ''}
                      onChange={value => {
                        if (value.split(' ').length !== 24)
                          setpassphraseInputs(prev => {
                            const newInputs = [...prev]
                            newInputs[idx] = value
                            return newInputs
                          })
                      }}
                    />
                  </li>
                ))}
              </ol>
            )}
            <button
              aria-label="Store passphrase securely on device storage"
              className="px-5 py-2 text-xl font-bold bg-purple-400 transition-all text-purple-50 rounded dark:bg-gray-800 disabled:cursor-default disabled:opacity-60"
              disabled={
                (seedInput === '' && !isPassphrase) ||
                (passphraseInputs.length !== 24 && isPassphrase)
              }
              onClick={onStoreClick}
            >
              store passphrase
            </button>
            <aside className="text-xs">
              again, your passphrase will{' '}
              <b className="font-extrabold">
                <em>never</em>
              </b>{' '}
              leave your device, and will only be decrypted for a brief moment
              on each transaction
            </aside>
          </>
        )}
      </div>
    </>
  )
}

export default SeedOrPassphrase
