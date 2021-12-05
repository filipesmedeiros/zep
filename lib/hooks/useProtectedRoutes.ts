import { useRouter } from 'next/router'
import { useEffect } from 'react'

import useCredentialId from './useCredentialId'
import useIsWelcoming from './useIsWelcoming'

const useProtectedRoutes = () => {
  const { replace, pathname } = useRouter()
  const isWelcoming = useIsWelcoming()
  const { credentialId, checking } = useCredentialId()

  useEffect(() => {
    if (!checking && credentialId === undefined && !isWelcoming)
      replace('/welcome')
  }, [replace, pathname, isWelcoming, credentialId, checking])

  return checking
}

export default useProtectedRoutes
