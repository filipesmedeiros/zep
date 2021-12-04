import { FingerPrintIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import { checkBiometrics } from '../lib/biometrics'
import { usePreferences } from '../lib/context/preferencesContext'

const Landing = () => {
  const { push } = useRouter()
  const {
    preferences: { biometricsAuth },
  } = usePreferences()

  console.log(push, biometricsAuth)

  useEffect(() => {
    const auth = async () => {
      try {
        await checkBiometrics()
        push('/dashboard')
      } catch {}
    }
    if (biometricsAuth) auth()
  }, [push, biometricsAuth])

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h1 className="text-4xl font-medium mb-16">welcome</h1>
      <button className="p-3 dark:bg-gray-800 bg-purple-50 mb-3 rounded shadow hover:cursor-pointer">
        <FingerPrintIcon className="h-16 text-gray-900 dark:text-purple-50" />
      </button>
      <h2 className="text-2xl text-center">
        please sign in with your biometrics
      </h2>
    </main>
  )
}

export default Landing
