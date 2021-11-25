import { AES, enc } from 'crypto-js'

import { checkBiometrics } from './biometrics'
import { getEncryptedSeed } from './db/encryptedSeeds'

const decryptSeed = async (id: 'os' | 'pin') => {
  const encryptedSeed = (await getEncryptedSeed(id))?.encryptedSeed
  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics()
  console.log({ sig })
  return AES.decrypt(encryptedSeed!, sig.toString()).toString(enc.Utf8)
}

export default decryptSeed
