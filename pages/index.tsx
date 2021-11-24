import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import PinPad from '../components/PinPad'
import { checkBiometrics, registerBiometrics } from '../lib/biometrics'
import { EncryptedSeedId, removeEncryptedSeed } from '../lib/db/encryptedSeeds'
import { prefersBiometricsAuth } from '../lib/preferences/biometricsAuth'

const Landing = () => {
  const { push } = useRouter()
  useEffect(() => {
    if (prefersBiometricsAuth()) {
      const auth = async () => {
        try {
          await checkBiometrics()
          push('/dashboard')
        } catch {
          removeEncryptedSeed(EncryptedSeedId.Os)
          await registerBiometrics()
          push('/dashboard')
        }
      }
      auth()
    }
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
