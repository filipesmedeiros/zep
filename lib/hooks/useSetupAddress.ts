import { useCallback, useState } from 'react'

import { useAddress } from '../context/addressContext'
import { getAddress } from '../db/addresses'
import useSetup from './useSetup'

const useSetupAddress = (skip?: boolean) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const setupAddress = useCallback(async () => {
    const dbAddress = (await getAddress(0))?.address
    if (dbAddress !== undefined) setAddress(dbAddress)
  }, [setAddress])
  const settingUp = useSetup(setupAddress, skip)
  return { address, settingUp }
}

export default useSetupAddress
