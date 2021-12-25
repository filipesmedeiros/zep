import { useCallback, useState } from 'react'
import useSWRInfinite from 'swr/infinite'

import { useCurrentAccount } from '../context/accountContext'
import type { AccountHistoryResponse } from '../types'
import fetchAccountHistory from '../xno/fetchAccountHistory'

const useAccountHistory = (pageSize = 20) => {
  const account = useCurrentAccount()

  const getKey = (index: number, prevPage: AccountHistoryResponse | null) => {
    if (account === undefined) return null

    if (prevPage !== null && prevPage.previous === undefined) return null

    if (index === 0) return `history`

    return `history?cursor=${prevPage!.previous}`
  }

  const {
    data: accountHistory,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<AccountHistoryResponse>(getKey, (key: string) =>
    fetchAccountHistory(
      account!.address,
      pageSize,
      key.split('=')[1] === key ? undefined : key.split('=')[1]
    )
  )

  const hasMore = accountHistory?.[size - 1]?.previous !== undefined
  const loadMore = () => setSize(prev => prev + 1)
  const hasHistory =
    accountHistory !== undefined &&
    accountHistory.length > 0 &&
    accountHistory[0].history !== ''

  const [refetching, setRefetching] = useState(false)
  const refetch = useCallback(() => {
    setRefetching(true)
    mutate().then(() => setRefetching(false))
  }, [mutate])

  return {
    accountHistory,
    loadMore,
    hasMore,
    loading: isValidating,
    hasHistory,
    refetch,
    refetching,
  }
}

export default useAccountHistory
