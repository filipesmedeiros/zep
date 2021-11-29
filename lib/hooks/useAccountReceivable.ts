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
import useListenToReceivable from './useListenToReceivable'

const useAccountReceivable = () => {
  const account = useCurrentAccount()

  const { data: receivableBlocks, mutate: mutateReceivable } = useSWR<
    {
      hash: string
      amount: string
      from: string
      timestamp: string
    }[]
  >(
    account !== undefined ? `receivable:${account.address}` : null,
    (key: string) =>
      fetchAccountReceivable(key.split(':')[1]).then(async ({ blocks }) => {
        const receivable = blocks[account!.address]
        if (receivable === '') return []
        else {
          const blocksInfo = await fetchBlocksInfo(
            Object.entries(receivable).map(([hash]) => hash)
          )
          return Object.entries(receivable).map(
            ([hash, { amount, source }]) => ({
              hash,
              amount,
              from: source,
              timestamp: blocksInfo.blocks[hash].local_timestamp,
            })
          )
        }
      })
  )

  const onBlockReceived = useCallback(
    (hash: string) => {
      mutateReceivable(current => {
        if (current === undefined || account === undefined) return current
        return current.filter(block => block.hash !== hash)
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
        const blocksInfo = await fetchBlocksInfo([hash])
        return [
          ...current,
          {
            hash,
            amount,
            from: source,
            timestamp: blocksInfo.blocks[hash].local_timestamp,
          },
        ]
      })
    },
    [mutateReceivable, account]
  )

  const onNewReceivable = useCallback(
    (confirmation: ConfirmationMessage) =>
      addReceivable({
        hash: confirmation.message.hash,
        amount: confirmation.message.amount,
        source: confirmation.message.account,
      }),
    [addReceivable]
  )

  useListenToReceivable(onNewReceivable)

  return {
    receivableBlocks,
    onBlockReceived,
  }
}

export default useAccountReceivable
