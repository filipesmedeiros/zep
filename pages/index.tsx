import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import PinPad from '../components/PinPad'
import { checkBiometrics } from '../lib/biometrics'
import { getPreference } from '../lib/db/preferences'

const Landing = () => {
  const { push } = useRouter()

  useEffect(() => {
    const auth = async () => {
      if (await getPreference('biometricsAuth')) {
        try {
          await checkBiometrics()
          push('/dashboard')
        } catch {}
      }
    }
    auth()
  }, [push])

  return (
    <main className="flex flex-col items-center justify-evenly h-full w-full">
      <header className="flex flex-col justify-center h-24">
        <h1 className="text-4xl">welcome</h1>
      </header>
      <PinPad />
    </main>
  )
}

export default Landing
