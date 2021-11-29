import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { useCurrentAccount } from '../context/accountContext'
import type {
  AccountReceivableResponse,
  BlocksInfoResponse,
  ConfirmationMessage,
} from '../types'
import fetchAccountReceivable from '../xno/fetchAccountReceivable'
import fetchBlocksInfo from '../xno/fetchBlocksInfo'
import useListenToReceivables from './useListenToReceivables'

const useAccountReceivable = () => {
  const account = useCurrentAccount()

  const { data: receivableBlocks, mutate: mutateReceivable } =
    useSWR<AccountReceivableResponse>(
      account !== undefined ? `receivable:${account.address}` : null,
      (key: string) => fetchAccountReceivable(key.split(':')[1])
    )

  const { data: receivableBlocksInfo } = useSWR<BlocksInfoResponse>(
    receivableBlocks !== undefined
      ? [
          Object.values(receivableBlocks.blocks)
            .map(blocks => Object.keys(blocks))
            .flat()
            .join(','),
        ]
      : null,
    (key: string) => fetchBlocksInfo(key.split(','))
  )

  const onBlockReceived = useCallback(
    (hash: string) => {
      mutateReceivable(async current => {
        if (current === undefined || account === undefined) return current
        const { blocks } = current
        const currBlocks = blocks[account.address]
        if (currBlocks === '') return current
        const newBlocks = { ...currBlocks }
        delete newBlocks[hash]
        return { blocks: { [account.address]: newBlocks } }
      })
    },
    [mutateReceivable, account]
  )

  const addReceivable = useCallback(
    ({
      hash,
      amount,
      source,
    }: {
      hash: string
      amount: string
      source: string
    }) => {
      mutateReceivable(async current => {
        if (current === undefined || account === undefined) return current
        const { blocks } = current
        const currBlocks = blocks[account.address]
        if (currBlocks === '') return current
        const newBlocks = { ...currBlocks, [hash]: { amount, source } }
        return { blocks: { [account.address]: newBlocks } }
      })
    },
    [mutateReceivable, account]
  )

  const onNewReceivable = useCallback(
    (confirmation: ConfirmationMessage) => {
      addReceivable({
        hash: confirmation.message.hash,
        amount: confirmation.message.amount,
        source: confirmation.message.account,
      })
    },
    [addReceivable]
  )

  useListenToReceivables(onNewReceivable)

  return {
    receivableBlocks,
    receivableBlocksInfo,
    onBlockReceived,
  }
}

export default useAccountReceivable
