import { addKey, getKey } from './keyStore'

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
  addKey(credential!.rawId)
}

export const checkBiometrics = async () => {
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)

  const key = await getKey()

  if (key === undefined) {
    await registerBiometrics()
    return
  }

  const getCredentialDefaultArgs: CredentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      challenge: randomBytes,
      allowCredentials: [
        {
          id: key.key,
          transports: ['internal'] as AuthenticatorTransport[],
          type: 'public-key' as 'public-key',
        },
      ],
      userVerification: 'preferred',
    },
  }
  return navigator.credentials.get(getCredentialDefaultArgs)
}
