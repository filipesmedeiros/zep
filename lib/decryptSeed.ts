import { AES, enc } from 'crypto-js'

import { checkBiometrics } from './biometrics'
import { getEncryptedSeed } from './db/encryptedSeeds'

const decryptSeed = async (id: 'os' | 'pin') => {
  const encryptedSeed = await getEncryptedSeed(id)
  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics()
  const decryptedSeed = AES.decrypt(encryptedSeed!, sig.toString()).toString(
    enc.Utf8
  )
  return decryptedSeed
}

export default decryptSeed
