import cbor from 'cbor'
import { AES } from 'crypto-js'
import {
  deriveAddress,
  derivePublicKey,
  deriveSecretKey,
  generateSeed,
} from 'nanocurrency'

import { addAddress } from './db/addresses'
import { getChallenge } from './db/challenges'
import {
  EncryptedSeedId,
  addEncryptedSeed,
  getEncryptedSeed,
} from './db/encryptedSeeds'

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
      attestation: 'direct',
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
  const { attStmt: sig } = cbor.decode(credential!.response.attestationObject)

  const newSeed = await generateSeed()

  console.log(newSeed)

  const encryptedSeed = AES.encrypt(newSeed, sig.toString()).toString()
  console.log(encryptedSeed)
  await addEncryptedSeed(EncryptedSeedId.Os, encryptedSeed)

  addAddress(
    0,
    deriveAddress(derivePublicKey(deriveSecretKey(newSeed, 0)), {
      useNanoPrefix: true,
    })
  )
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
