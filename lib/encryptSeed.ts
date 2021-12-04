import { AES } from 'crypto-js'

import { checkBiometrics } from './biometrics'

const encryptSeed = async ({
  seed,
  challenge,
  rawId,
}: {
  seed: string
  challenge: Uint8Array
  rawId: Uint8Array
}) => {
  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics({ challenge, rawId })
  const encryptedSeed = AES.encrypt(seed, sig.toString()).toString()
  return encryptedSeed
}

export default encryptSeed
