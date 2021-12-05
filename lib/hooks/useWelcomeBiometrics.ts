import { useCallback, useEffect } from 'react'

import { checkBiometrics } from '../biometrics'
import useChallenge from './useChallenge'
import useCredentialId from './useCredentialId'

const useCheckBiometrics = (onChecked: (validBiometrics: boolean) => void) => {
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const check = useCallback(async () => {
    try {
      if (credentialId !== undefined && challenge !== undefined) {
        await checkBiometrics({ challenge, rawId: credentialId })
        onChecked(true)
      }
    } catch {
      onChecked(false)
    }
  }, [challenge, credentialId, onChecked])

  useEffect(() => {
    check()
  }, [check])

  return check
}

export default useCheckBiometrics
