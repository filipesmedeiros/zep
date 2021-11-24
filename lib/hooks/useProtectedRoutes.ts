import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getCryptoAsset } from '../db/cryptoAssets'

const useProtectedRoutes = () => {
  const { replace, pathname } = useRouter()
  const [validatingCredential, setValidatingCredential] = useState(true)
  useEffect(() => {
    if (pathname === '/welcome') {
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
  }, [replace, pathname])
  return validatingCredential
}

export default useProtectedRoutes
