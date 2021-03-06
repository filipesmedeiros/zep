import { FingerPrintIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'

import useCheckBiometrics from '../lib/hooks/useWelcomeBiometrics'
import showNotification from '../lib/showNotification'

const Landing = () => {
  const { replace } = useRouter()

  const { check: lazyCheck, didFirstCheck } = useCheckBiometrics(valid => {
    if (valid) replace('/dashboard')
    else
      showNotification({
        title: 'biometrics authentication failed',
        body: "zep couldn't verify your identity",
        tag: 'biometrics check',
      })
  })

  return (
    <>
      <Head>
        <title>zep⚡️ - Sign in</title>
      </Head>
      <main className="flex flex-col items-center w-full h-full">
        <h1 className="text-4xl font-medium mb-16">Welcome</h1>
        <button
          onClick={lazyCheck}
          aria-label="Trigger biometrics authentication"
          className="p-3 dark:bg-gray-800 bg-purple-50 mb-3 rounded shadow hover:cursor-pointer"
        >
          <FingerPrintIcon className="h-16 text-gray-900 dark:text-purple-50" />
        </button>
        <h2 className="text-2xl text-center">
          {didFirstCheck
            ? 'Click to sign in with your biometrics'
            : 'Signing in with your biometrics'}
        </h2>
      </main>
    </>
  )
}

export default Landing
