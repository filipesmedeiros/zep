import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useCredentialId from './useCredentialId'
import useIsWelcoming from './useIsWelcoming'

const useProtectedRoutes = () => {
  const { replace } = useRouter()
  const isWelcoming = useIsWelcoming()
  const { credentialId, checking } = useCredentialId()

  const [safeToRender, setSafeToRender] = useState(false)

  useEffect(() => {
    if (!checking && credentialId === undefined && !isWelcoming)
      replace('/welcome')
    else if (!checking && credentialId !== undefined && isWelcoming)
      replace('/')
    else if (!checking) setSafeToRender(true)
  }, [replace, isWelcoming, credentialId, checking])

  return { safeToRender }
}

export default useProtectedRoutes
