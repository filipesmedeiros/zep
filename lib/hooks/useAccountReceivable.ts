import { useEffect, useState } from 'react'

import { useCurrentAccount } from '../context/accountContext'
import type { AccountReceivableResponse, BlocksInfoResponse } from '../types'
import fetchAccountReceivable from '../xno/fetchAccountReceivable'
import fetchBlocksInfo from '../xno/fetchBlocksInfo'

type ReturnValue =
  | {
      accountReceivable: undefined
      blocksInfo: undefined
      loading: true
    }
  | {
      accountReceivable: AccountReceivableResponse
      blocksInfo: BlocksInfoResponse
      loading: false
    }

const useAccountReceivable = (): ReturnValue => {
  const [accountReceivableWithInfo, setAccountReceivableWithInfo] = useState<{
    accountReceivable: AccountReceivableResponse | undefined
    blocksInfo: BlocksInfoResponse | undefined
  }>({ accountReceivable: undefined, blocksInfo: undefined })

  const account = useCurrentAccount()

  useEffect(() => {
    if (account !== undefined) {
      const fetchReceivable = async () => {
        const receivableBlocks = await fetchAccountReceivable(account.address)
        const blocksInfo = await fetchBlocksInfo(
          Object.values(receivableBlocks.blocks)
            .map(blocks => Object.keys(blocks))
            .flat()
        )
        setAccountReceivableWithInfo({
          accountReceivable: receivableBlocks,
          blocksInfo,
        })
      }

      fetchReceivable()
    }
  }, [account])

  const loading =
    accountReceivableWithInfo.accountReceivable === undefined &&
    accountReceivableWithInfo.blocksInfo === undefined
  return { ...accountReceivableWithInfo, loading } as ReturnValue
}

export default useAccountReceivable
