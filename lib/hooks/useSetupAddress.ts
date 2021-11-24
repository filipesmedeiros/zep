import { useCallback } from 'react'

import { useAddress } from '../context/addressContext'
import { getAddress } from '../db/addresses'
import useSetup from './useSetup'

const useSetupAddress = (skip?: boolean) => {
  const { setAddress, address } = useAddress()
  const setupAddress = useCallback(async () => {
    const dbAddress = (await getAddress(0))?.address
    if (dbAddress !== undefined && address === undefined) setAddress(dbAddress)
  }, [address, setAddress])
  return useSetup(setupAddress, skip)
}

export default useSetupAddress
