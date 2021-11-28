import { useEffect, useState } from 'react'

import { useCurrentAccount } from '../context/accountContext'
import type { AccountHistoryResponse } from '../types'
import fetchAccountHistory from '../xno/fetchAccountHistory'

type ReturnValue =
  | {
      accountHistory: undefined
      loading: true
    }
  | { accountHistory: AccountHistoryResponse; loading: false }

const useAccountHistory = (): ReturnValue => {
  const [accountHistory, setAccountHistory] = useState<
    AccountHistoryResponse | undefined
  >(undefined)

  const account = useCurrentAccount()

  useEffect(() => {
    if (account !== undefined)
      fetchAccountHistory(account.address).then(setAccountHistory)
  }, [account])

  const loading = accountHistory === undefined
  return { accountHistory, loading } as ReturnValue
}

export default useAccountHistory
