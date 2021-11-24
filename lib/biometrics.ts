import cbor from 'cbor'

import { getChallenge } from './db/challenges'
import { EncryptedSeedId, getEncryptedSeed } from './db/encryptedSeeds'

export const registerBiometrics = async () => {
  const challenge = await getChallenge('osChallenge')
  if (challenge === undefined) {
    // ? todo
    throw new Error('challenge_not_found')
  }

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
      timeout: 30000,
      challenge: challenge.challenge,
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
    },
  }

  // register / create a new credential
  const credential = await navigator.credentials.create(
    createCredentialDefaultArgs
  )

  // @ts-expect-error ts hasn't implemented
  const decoded = cbor.decode(credential!.response.attestationObject)

  console.log(decoded)

  // // @ts-expect-error not implemented by ts yet
  // return addEncryptedSeed(EncryptedSeedId.Os, credential!.rawId)
}

export const checkBiometrics = async () => {
  const challenge = await getChallenge('osChallenge')
  if (challenge === undefined) {
    // ? todo
    throw new Error('challenge_not_found')
  }

  const encryptedSeed = await getEncryptedSeed(EncryptedSeedId.Os)

  if (encryptedSeed === undefined) {
    await registerBiometrics()
    return
  }

  const getCredentialParams: CredentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      challenge: challenge.challenge,
      allowCredentials: [
        {
          id: new Uint8Array(),
          transports: ['internal'] as AuthenticatorTransport[],
          type: 'public-key' as 'public-key',
        },
      ],
      userVerification: 'required',
    },
  }

  const challengeResponse = await navigator.credentials.get(getCredentialParams)
  return challengeResponse
}
