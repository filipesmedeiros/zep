import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'

import PinPad from '../components/PinPad'
import { checkBiometrics } from '../lib/biometrics'
import { useAddress } from '../lib/context/addressContext'
import { getAddress } from '../lib/db/addresses'
import { addCryptoAsset, hasCryptoAsset } from '../lib/db/cryptoAssets'
import { prefersBiometricsAuth } from '../lib/preferences/biometricsAuth'

const Landing = () => {
  const { push } = useRouter()

  const { setAddress } = useAddress()

  useEffect(() => {
    const setupOsChallenge = async () => {
      if (!(await hasCryptoAsset('challenge'))) {
        const randomBytes = new Uint8Array(32)
        crypto.getRandomValues(randomBytes)
        addCryptoAsset('challenge', randomBytes)
      }
    }

    const auth = async () => {
      if (prefersBiometricsAuth()) {
        await checkBiometrics()
        push('/dashboard')
      }
    }

    const setupAddress = async () => {
      const address = (await getAddress(0))?.address
      if (address !== undefined) setAddress(address)
    }

    setupOsChallenge().then(auth).then(setupAddress)
  }, [push, setAddress])

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
