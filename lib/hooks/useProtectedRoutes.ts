import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getCryptoAsset } from '../db/cryptoAssets'
import useIsWelcoming from './useIsWelcoming'

const useProtectedRoutes = () => {
  const { replace, pathname } = useRouter()
  const [validatingCredential, setValidatingCredential] = useState(true)
  const isWelcoming = useIsWelcoming()
  useEffect(() => {
    if (isWelcoming) {
      setValidatingCredential(false)
      return
    }

    const checkCredential = async () => {
      const hasCredentialId =
        (await getCryptoAsset('credentialId')) !== undefined
      if (!hasCredentialId) replace('/welcome')
      else setValidatingCredential(false)
    }
    checkCredential()
  }, [replace, pathname, isWelcoming])
  return validatingCredential
}

export default useProtectedRoutes
