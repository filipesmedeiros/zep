import useSWR from 'swr'

import { useCurrentAccount } from '../context/accountContext'
import { AccountInfoResponse } from '../types'
import fetchAccountInfo from '../xno/fetchAccountInfo'

const useAccountInfo = () => {
  const account = useCurrentAccount()
  return useSWR<AccountInfoResponse>(
    account !== undefined ? `info:${account.address}` : null,
    (key: string) => fetchAccountInfo(key.split(':')[1])
  )
}

export default useAccountInfo
