import { TrashIcon } from '@heroicons/react/solid'
import type { NextPage } from 'next'
import Head from 'next/head'

import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import { checkBiometrics } from '../lib/biometrics'
import { removeAllAccounts } from '../lib/db/accounts'
import { removeCryptoAsset } from '../lib/db/cryptoAssets'
import { removeEncryptedSeed } from '../lib/db/encryptedSeeds'
import useChallenge from '../lib/hooks/useChallenge'
import useCredentialId from '../lib/hooks/useCredentialId'

const Reset: NextPage = () => {
  const { credentialId } = useCredentialId()
  const { challenge } = useChallenge()
  const onReset = async () => {
    await checkBiometrics({ challenge: challenge!, rawId: credentialId! })
    await Promise.all([
      removeEncryptedSeed('os'),
      removeAllAccounts(),
      removeCryptoAsset('credentialId'),
    ])
    window.location.href = '/welcome'
  }
  return (
    <>
      <Head>
        <title>zep⚡️ - reset wallet</title>
      </Head>
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="flex items-center w-full gap-2">
          <TrashIcon className="dark:text-purple-50 h-7 xs:h-8 text-gray-900 translate-x-1 transition-colors" />
          <span className="text-3xl sm:text-5xl font-medium">
            remove wallet
          </span>
        </h1>

        <h2 className="font-bold text-xl text-center">
          make sure you have your seed stored securely outside zep before
          continuing, or
          <br />
          <span className="font-extrabold text-purple-400">
            you will lose your xno!
          </span>
        </h2>
        <hr />
        <h3 className="font-extrabold text-2xl text-center sr-only xs:not-sr-only">
          are you sure you want to remove this wallet?
        </h3>

        <div className="flex flex-col gap-2">
          <Button onClick={onReset} variant="primary">
            remove wallet
          </Button>
          <ButtonLink href="/">go back</ButtonLink>
        </div>
      </div>
    </>
  )
}

export default Reset
