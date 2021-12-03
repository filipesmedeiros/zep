import { AES } from 'crypto-js'

import { checkBiometrics } from './biometrics'

const encryptSeed = async (seed: string) => {
  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics()
  const encryptedSeed = AES.encrypt(seed, sig.toString()).toString()
  return encryptedSeed
}

export default encryptSeed
