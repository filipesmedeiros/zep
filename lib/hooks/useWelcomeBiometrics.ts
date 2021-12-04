import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { checkBiometrics } from '../biometrics'
import useChallenge from './useChallenge'
import useCredentialId from './useCredentialId'

const useCheckBiometrics = () => {
  const challenge = useChallenge()
  const credentialId = useCredentialId()
  const { replace } = useRouter()

  useEffect(() => {
    const check = async () => {
      try {
        if (credentialId !== undefined && challenge !== undefined)
          await checkBiometrics({ challenge, rawId: credentialId })
        replace('/dashboard')
      } catch {}
    }
    check()
  }, [replace, challenge, credentialId])
}

export default useCheckBiometrics
