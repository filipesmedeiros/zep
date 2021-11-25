import { useCallback, useState } from 'react'

import { getAccount } from '../db/accounts'
import useSetup from './useSetup'

const useSetupAddress = (skip?: boolean) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const setupAddress = useCallback(async () => {
    const dbAddress = await getAccount(0)
    if (dbAddress !== undefined) setAddress(dbAddress)
  }, [setAddress])
  const { settingUp } = useSetup(setupAddress, skip)
  return { address, settingUp }
}

export default useSetupAddress
