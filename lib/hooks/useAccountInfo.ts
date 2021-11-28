import { useEffect, useState } from 'react'

import { useCurrentAccount } from '../context/accountContext'
import { AccountInfoResponse } from '../types'
import fetchAccountInfo from '../xno/fetchAccountInfo'

type ReturnValue =
  | {
      accountInfo: undefined
      loading: true
    }
  | { accountInfo: AccountInfoResponse; loading: false }

const useAccountInfo = (): ReturnValue => {
  const [accountInfo, setAccountInfo] = useState<
    AccountInfoResponse | undefined
  >(undefined)

  const account = useCurrentAccount()

  useEffect(() => {
    if (account !== undefined)
      fetchAccountInfo(account.address).then(setAccountInfo)
  }, [account])

  const loading = accountInfo === undefined
  return { accountInfo, loading } as ReturnValue
}

export default useAccountInfo
