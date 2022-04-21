import { useCallback, useEffect, useState } from 'react'

import { checkBiometrics } from '../biometrics'
import useChallenge from './useChallenge'
import useCredentialId from './useCredentialId'

const useCheckBiometrics = (onChecked: (validBiometrics: boolean) => void) => {
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const [didFirstCheck, setDidFirstCheck] = useState(false)

  const check = useCallback(async () => {
    try {
      if (credentialId !== undefined && challenge !== undefined) {
        await checkBiometrics({ challenge, rawId: credentialId })
        onChecked(true)
        setDidFirstCheck(true)
      }
    } catch {
      onChecked(false)
      setDidFirstCheck(true)
    }
  }, [challenge, credentialId, onChecked])

  useEffect(() => {
    check()
  }, [check])

  return { didFirstCheck, check }
}

export default useCheckBiometrics
