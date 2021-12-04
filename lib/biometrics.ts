import cbor from 'cbor'

import { addCryptoAsset, getCryptoAsset } from './db/cryptoAssets'

// with help from the incredible https://webauthn.guide/#authentication

export const createCredentialDefaultArgs = (
  challenge: Uint8Array
): CredentialCreationOptions => ({
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
    challenge,
    attestation: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
  },
})

export const registerBiometrics = async (challenge: Uint8Array) => {
  const args = createCredentialDefaultArgs(challenge!)
  const credential = await navigator.credentials.create(args)
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
  addCryptoAsset('credentialId', credentialId)
  return credentialId as Uint8Array
}

export const checkBiometrics = async ({
  challenge,
  rawId,
}: {
  challenge: Uint8Array
  rawId: Uint8Array
}) => {
  const getCredentialParams: CredentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      challenge: challenge,
      allowCredentials: [
        {
          id: rawId,
          transports: ['internal'],
          type: 'public-key',
        },
      ],
      userVerification: 'required',
    },
    mediation: 'required',
  }

  return navigator.credentials.get(getCredentialParams)
}
