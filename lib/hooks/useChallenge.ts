import useCryptoAsset from './useCryptoAsset'

const useChallenge = () => {
  const { checking, cryptoAsset } = useCryptoAsset('challenge')
  return { checking, challenge: cryptoAsset }
}

export default useChallenge
