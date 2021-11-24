import { getChallenge } from './db/challenges'
import { EncryptedSeedId, getEncryptedSeed } from './db/encryptedSeeds'

export const registerBiometrics = async () => {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)

  const createCredentialDefaultArgs: CredentialCreationOptions = {
    publicKey: {
      rp: { name: 'biometrics' },
      user: {
        displayName: 'user',
        name: 'user',
        id: new Uint8Array(),
      },
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7,
        },
      ],
      attestation: 'direct' as AttestationConveyancePreference,
      timeout: 30000,
      challenge: randomBytes,
    },
  }

  // register / create a new credential
  const credential = await navigator.credentials.create(
    createCredentialDefaultArgs
  )
  // @ts-expect-error not implemented by ts yet
  return addKey(credential!.rawId)
}

export const checkBiometrics = async () => {
  const challenge = await getChallenge('osChallenge')
  if (challenge === undefined) {
    // ? todo
    throw new Error()
  }

  const encryptedSeed = await getEncryptedSeed(EncryptedSeedId.Os)

  if (encryptedSeed === undefined) {
    // todo
    throw new Error()
  }

  const getCredentialParams: CredentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      challenge: challenge.challenge,
      allowCredentials: [
        {
          id: encryptedSeed.encryptedSeed,
          transports: ['internal'] as AuthenticatorTransport[],
          type: 'public-key' as 'public-key',
        },
      ],
      userVerification: 'preferred',
    },
  }

  const challengeResponse = await navigator.credentials.get(getCredentialParams)
  console.log(challengeResponse)
  return challengeResponse
}
