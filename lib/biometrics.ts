import cbor from 'cbor'

import { addCryptoAsset, getCryptoAsset } from './db/cryptoAssets'

// with help from the incredible https://webauthn.guide/#authentication

export const registerBiometrics = async () => {
  const challenge = await getCryptoAsset('challenge')
  if (challenge === undefined) throw new Error('challenge_not_found')

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
}

export const checkBiometrics = async () => {
  const [challenge, credentialId] = await Promise.all([
    getCryptoAsset('challenge'),
    getCryptoAsset('credentialId'),
  ])
  if (challenge === undefined) throw new Error('challenge_not_found')
  if (credentialId === undefined) throw new Error('credentialId_not_found')

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

  return navigator.credentials.get(getCredentialParams)
}
