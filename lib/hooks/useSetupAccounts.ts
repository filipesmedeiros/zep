import { useCallback, useState } from 'react'

import { getAccount, putAccount } from '../db/accounts'
import fetchAccountInfo from '../nano/fetchAccountInfo'
import { AccountInfoCache } from '../types'
import useSetup from './useSetup'

const useSetupAccounts = (skip?: boolean) => {
  const [accounts, setAccounts] = useState<
    { [key: number]: AccountInfoCache } | undefined
  >(undefined)
  const setupAddress = useCallback(async () => {
    const dbAccount = await getAccount(0)
    if (dbAccount !== undefined) {
      setAccounts({ 0: dbAccount })
      const infoRes = await fetchAccountInfo(dbAccount.address)

      const freshAccountInfo = {
        ...dbAccount,
        frontier: 'error' in infoRes ? null : infoRes.confirmed_frontier,
        representative:
          'error' in infoRes ? null : infoRes.confirmed_representative,
      }
      setAccounts({ 0: freshAccountInfo })
      putAccount(dbAccount.index, freshAccountInfo)
    }
  }, [setAccounts])
  const { settingUp } = useSetup(setupAddress, skip)
  return { accounts, settingUp }
}

export default useSetupAccounts
