import cbor from 'cbor'
import { AES } from 'crypto-js'
import {
  deriveAddress,
  derivePublicKey,
  deriveSecretKey,
  generateSeed,
} from 'nanocurrency'

import { addAddress } from './db/addresses'
import { addCryptoAsset, getCryptoAsset } from './db/cryptoAssets'
import {
  EncryptedSeedId,
  addEncryptedSeed,
  getEncryptedSeed,
} from './db/encryptedSeeds'

// with help from the incredible https://webauthn.guide/#authentication

export const registerBiometrics = async () => {
  const challenge = await getCryptoAsset('challenge')
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
      challenge: challenge.cryptoAsset,
      attestation: 'direct',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
    },
  }

  const credential = await navigator.credentials.create(
    createCredentialDefaultArgs
  )

  const { authData } = cbor.decode(
    // @ts-expect-error ts hasn't implemented
    credential!.response.attestationObject
  )

  const dataView = new DataView(new ArrayBuffer(2))
  const idLenBytes = authData.slice(53, 55)
  idLenBytes.forEach((value: any, index: number) =>
    dataView.setUint8(index, value)
  )
  const credentialIdLength = dataView.getUint16(0)
  const credentialId = authData.slice(55, 55 + credentialIdLength)
  await addCryptoAsset('credentialId', credentialId)

  const newSeed = await generateSeed()
  console.log(newSeed)

  const {
    // @ts-expect-error
    response: { signature: sig },
  } = await checkBiometrics()
  const encryptedSeed = AES.encrypt(newSeed, sig.toString()).toString()
  await addEncryptedSeed('os', encryptedSeed)
  console.log({ encryptedSeed })

  const firstAddress = deriveAddress(
    derivePublicKey(deriveSecretKey(newSeed, 0)),
    {
      useNanoPrefix: true,
    }
  )
  console.log({ firstAddress })
  addAddress(0, firstAddress)
}

export const checkBiometrics = async () => {
  const challenge = await getCryptoAsset('challenge')
  if (challenge === undefined) {
    // ? todo
    throw new Error('challenge_not_found')
  }

  const credentialId = await getCryptoAsset('credentialId')

  if (credentialId === undefined) {
    await registerBiometrics()
    return
  }

  const getCredentialParams: CredentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      challenge: challenge.cryptoAsset,
      allowCredentials: [
        {
          id: credentialId.cryptoAsset,
          transports: ['internal'] as AuthenticatorTransport[],
          type: 'public-key' as 'public-key',
        },
      ],
      userVerification: 'required',
    },
    mediation: 'required',
  }

  const challengeResponse = await navigator.credentials.get(getCredentialParams)
  return challengeResponse
}
