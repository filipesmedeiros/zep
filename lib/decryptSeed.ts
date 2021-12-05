import { AES, enc } from 'crypto-js'

import { checkBiometrics } from './biometrics'
import { getEncryptedSeed } from './db/encryptedSeeds'

const decryptSeed = async (
  params: {
    challenge: Uint8Array
    rawId: Uint8Array
    encryptedSeed: string
  },
  id: 'os' | 'pin' = 'os'
) => {
  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics(params)
  const decryptedSeed = AES.decrypt(
    params.encryptedSeed,
    sig.toString()
  ).toString(enc.Utf8)
  return decryptedSeed
}

export default decryptSeed
