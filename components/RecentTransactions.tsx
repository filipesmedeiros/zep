import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { tools } from 'nanocurrency-web'
import { FC, useCallback, useMemo, useState } from 'react'
import useSwr from 'swr'
import useSwrInfinite from 'swr/infinite'

import { useAddress } from '../lib/context/addressContext'
import fetcher from '../lib/fetcher'
import receiveNano from '../lib/nano/receiveNano'
import {
  AccountHistoryResponse,
  AccountPendingResponse,
  BlocksInfoResponse,
} from '../lib/types'

const rawToNanoDisplay = (raw: string) =>
  Number(tools.convert(raw, 'RAW', 'NANO').slice(0, 20))
    .toFixed(2)
    .replace(/^0\.00/, 'small')
    .replace('.00', '')

export interface Props {
  className?: string
}

const mockAddressBook: Record<string, { displayName: string }> = {
  nano_3cpz7oh9qr5b7obbcb5867omqf8esix4sdd5w6mh8kkknamjgbnwrimxsaaf: {
    displayName: 'kraken',
  },
}

const RecentTransactions: FC<Props> = ({ className }) => {
  const { address } = useAddress()
  const params = useCallback(
    (cursor: string | undefined) => ({
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify({
        action: 'account_history',
        account: address,
        count: 20,
        head: cursor,
      }),
    }),
    [address]
  )

  const { data: historyPages, setSize } =
    useSwrInfinite<AccountHistoryResponse>(
      (_, prevHistory) =>
        address === undefined
          ? null
          : prevHistory === null
          ? 'no-cursor'
          : prevHistory.previous ?? null,
      (cursor: 'no-cursor' | string) =>
        fetcher<AccountHistoryResponse>(
          'https://mynano.ninja/api/node',
          params(cursor === 'no-cursor' ? undefined : cursor)
        )
    )

  const paramsPending = useMemo(
    () => ({
      action: 'accounts_pending',
      accounts: [address],
      count: '20',
    }),
    [address]
  )
  const { data: pendingTxnHashes } = useSwr<AccountPendingResponse>(
    address !== undefined ? address : null,
    () =>
      fetcher<AccountPendingResponse>('https://mynano.ninja/api/node', {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify(paramsPending),
      })
  )
  const formattedPendingHashes = useMemo(
    () =>
      Object.values(pendingTxnHashes?.blocks ?? {}).flatMap(hashes => hashes),
    [pendingTxnHashes]
  )

  const paramsPendingInfo = useCallback(
    (hashes: string[]) => ({
      action: 'blocks_info',
      json_block: 'true',
      hashes,
    }),
    []
  )
  const { data: pendingTxns } = useSwr<BlocksInfoResponse>(
    [formattedPendingHashes.length > 0 ? formattedPendingHashes : null],
    hashes =>
      fetcher<BlocksInfoResponse>('https://mynano.ninja/api/node', {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify(paramsPendingInfo(hashes)),
      })
  )

  const hasMoreTxns = historyPages?.at(-1)?.previous !== undefined

  const txns = useMemo(
    () =>
      historyPages?.flatMap(({ history }) =>
        (history !== '' ? history : []).map(txn => {
          return {
            send: txn.type === 'send',
            account: txn.account,
            hash: txn.hash,
            amount: txn.amount,
            timestamp: Number(txn.local_timestamp),
            receivable: false,
          }
        })
      ),
    [historyPages]
  )

  const mappedPendingTxns = useMemo(
    () =>
      (pendingTxns === undefined ? [] : Object.entries(pendingTxns.blocks)).map(
        ([hash, block]) => ({
          send: block.subtype !== 'send',
          account: block.block_account,
          hash,
          amount: block.amount,
          timestamp: Number(block.local_timestamp),
          receivable: true,
        })
      ),
    [pendingTxns]
  )

  const txnsWithPending = useMemo(
    () => [...(mappedPendingTxns ?? []), ...(txns ?? [])],
    [txns, mappedPendingTxns]
  )

  if (historyPages === undefined || address === undefined) return null

  const hasTxns = txnsWithPending.length > 0

  return (
    <div className={clsx('flex flex-col gap-6 w-full items-center', className)}>
      <h2 className="text-2xl font-semibold text-white">recent transactions</h2>
      {hasTxns ? (
        <ol className="flex flex-col gap-3 w-full">
          {txnsWithPending.map(txn => (
            <li
              key={txn.hash}
              className={clsx(
                'bg-white shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4',
                txn.send
                  ? 'border-yellow-500'
                  : txn.receivable
                  ? 'border-blue-500'
                  : 'border-green-500'
              )}
            >
              <button
                className="contents"
                onClick={() =>
                  receiveNano(address, txn.account, txn.hash, txn.amount)
                }
              >
                {txn.send ? (
                  <UploadIcon className="w-6 text-yellow-500 flex-shrink-0" />
                ) : (
                  <DownloadIcon
                    className={clsx(
                      'w-6 flex-shrink-0',
                      txn.receivable ? 'text-blue-500' : 'text-green-500'
                    )}
                  />
                )}
                <div className="overflow-hidden overflow-ellipsis text-left flex-1 whitespace-nowrap">
                  {Intl.DateTimeFormat([], {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  }).format(txn.timestamp * 1000)}{' '}
                  -{' '}
                  {mockAddressBook[txn.account]?.displayName ?? (
                    <span className="text-xs">{txn.account}</span>
                  )}
                </div>
                <span className="flex-shrink-0 font-medium">
                  Ӿ{' '}
                  {rawToNanoDisplay(txn.amount) === 'small' ? (
                    '<.01'
                  ) : rawToNanoDisplay(txn.amount).startsWith('0.') ? (
                    <>
                      <span className="text-sm font-semibold">0</span>
                      {rawToNanoDisplay(txn.amount).substring(1)}
                    </>
                  ) : (
                    rawToNanoDisplay(txn.amount)
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center pt-8">
          <p className="pb-4">no transactions yet...</p>
          <p>
            get your first nano
            <br />
            to see something here!
          </p>
        </div>
      )}
      {hasMoreTxns && (
        <button
          className="bg-purple-200 py-2 px-4 rounded dark:text-gray-900 font-bold shadow"
          onClick={() => setSize(prev => prev + 1)}
        >
          load more
        </button>
      )}
    </div>
  )
}

export default RecentTransactions
