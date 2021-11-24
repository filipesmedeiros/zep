import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import { FC, useCallback, useMemo, useState } from 'react'
import useSwrInfinite from 'swr/infinite'

import { useAddress } from '../lib/context/addressContext'
import fetcher from '../lib/fetcher'
import { AccountHistoryResponse } from '../lib/types'

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
        prevHistory === null ? 'no-cursor' : prevHistory.previous ?? null,
      (cursor: 'no-cursor' | string) =>
        fetcher<AccountHistoryResponse>(
          'https://mynano.ninja/api/node',
          params(cursor === 'no-cursor' ? undefined : cursor)
        )
    )

  if (historyPages === undefined) return null

  const hasMoreTxns = historyPages.at(-1)?.previous !== undefined

  const txns = historyPages.flatMap(({ history }) =>
    history.map(txn => {
      const amount = Number(
        convert(txn.amount, { from: Unit.raw, to: Unit.NANO }).slice(0, 20)
      )
        .toFixed(2)
        .replace(/^0\.00/, 'small')
        .replace('.00', '')
      return {
        send: txn.type === 'send',
        account: txn.account,
        hash: txn.hash,
        amount,
        timestamp: Number(txn.local_timestamp),
      }
    })
  )

  return (
    <div className={clsx('flex flex-col gap-6 w-full items-center', className)}>
      <h2 className="text-2xl font-semibold text-white">recent transactions</h2>
      <ol className="flex flex-col gap-3 w-full">
        {txns.map(txn => (
          <li
            key={txn.hash}
            className={clsx(
              'bg-white shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4',
              txn.send ? 'border-yellow-500' : 'border-green-500'
            )}
          >
            {txn.send ? (
              <UploadIcon className="w-6 text-yellow-500 flex-shrink-0" />
            ) : (
              <DownloadIcon className="w-6 text-green-500 flex-shrink-0" />
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
              {txn.amount === 'small' ? (
                '<.01'
              ) : txn.amount.startsWith('0.') ? (
                <>
                  <span className="text-sm font-semibold">0</span>
                  {txn.amount.substring(1)}
                </>
              ) : (
                txn.amount
              )}
            </span>
          </li>
        ))}
      </ol>
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
