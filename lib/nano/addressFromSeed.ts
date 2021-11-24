import { deriveAddress, derivePublicKey, deriveSecretKey } from 'nanocurrency'

const addressFromSeed = (seed: string, index: number) =>
  deriveAddress(derivePublicKey(deriveSecretKey(seed, index)), {
    useNanoPrefix: true,
  })

export default addressFromSeed
