import useSWR from 'swr'

import { useCurrentAccount } from '../context/accountContext'
import type { AccountHistoryResponse } from '../types'
import fetchAccountHistory from '../xno/fetchAccountHistory'

const useAccountHistory = () => {
  const account = useCurrentAccount()
  return useSWR<AccountHistoryResponse>(
    account !== undefined ? `history:${account.address}` : null,
    (key: string) => fetchAccountHistory(key.split(':')[1])
  )
}

export default useAccountHistory
