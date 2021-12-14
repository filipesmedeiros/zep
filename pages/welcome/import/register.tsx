import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { registerBiometrics } from '../../../lib/biometrics'
import useChallenge from '../../../lib/hooks/useChallenge'
import useCredentialId from '../../../lib/hooks/useCredentialId'

const Import: NextPage = () => {
  const { push, replace } = useRouter()

  const { credentialId } = useCredentialId()
  useEffect(() => {
    if (credentialId !== undefined) replace('/welcome/import')
  }, [replace, credentialId])

  const { challenge } = useChallenge()
  const onRegisterClick = async () => {
    await registerBiometrics(challenge!)
    push('/welcome/import')
  }

  return (
    <>
      <Head>
        <title>zep⚡️ - register biometrics</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-6 text-gray-900 dark:text-primary-50 transition-colors">
        <h1 className="font-extrabold text-3xl">register your biometrics</h1>
        <button
          aria-label="Register biometrics"
          className="px-5 py-2 text-xl font-bold bg-primary-400 transition-colors text-primary-50 rounded dark:bg-gray-800"
          onClick={onRegisterClick}
        >
          register biometrics
        </button>
        <p>
          <em>this will be used to encrypt your seed inside your device</em>
        </p>
      </div>
    </>
  )
}

export default Import
