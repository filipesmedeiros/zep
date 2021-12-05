import useCryptoAsset from './useCryptoAsset'

const useCredentialId = () => {
  const { checking, cryptoAsset } = useCryptoAsset('credentialId')
  return { checking, credentialId: cryptoAsset }
}

export default useCredentialId
