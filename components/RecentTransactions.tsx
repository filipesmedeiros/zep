import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import { FC, useMemo } from 'react'
import useSWR from 'swr'

import { useAddress } from '../lib/context/addressContext'
import fetcher from '../lib/fetcher'

export interface Props {
  className?: string
}

const mockAddressBook: Record<string, { displayName: string }> = {
  nano_17awby98awndu8awmdu8awydn8awuynd09awyubd08a: {
    displayName: 'dad',
  },
}

const RecentTransactions: FC<Props> = ({ className }) => {
  const { address } = useAddress()
  const params = useMemo(
    () => ({
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify({
        action: 'account_history',
        account: address,
        count: 20,
      }),
    }),
    [address]
  )

  const { data: history } = useSWR<{
    history: {
      type: 'send' | 'receive'
      send: boolean
      account: string
      hash: string
      amount: string
    }[]
  }>(address !== undefined ? ['https://mynano.ninja/api/node', params] : null, {
    fetcher,
  })

  if (history === undefined) return null

  const txns = history.history.map(txn => ({
    send: txn.type === 'send',
    account: txn.account,
    hash: txn.hash,
    amount: Number(
      convert(txn.amount, { from: Unit.raw, to: Unit.NANO }).slice(0, 20)
    )
      .toFixed(2)
      .replace(/^0\./, '.')
      .replace(/\.00/, '')
      .replace(/(?!\.\d)0/, ''),
  }))

  return (
    <div className={clsx('flex flex-col gap-6 w-full items-center', className)}>
      <h2 className="text-2xl font-semibold text-white">recent transactions</h2>
      <ol className="flex flex-col gap-4 w-full">
        {txns.map(txn => (
          <li
            key={txn.hash}
            className={clsx(
              'dark:bg-purple-100 bg-white shadow rounded px-4 py-3 flex items-center justify-between gap-4 text-black border-r-4',
              txn.send ? 'border-red-500' : 'border-green-500'
            )}
          >
            {txn.send ? (
              <UploadIcon className="w-6 text-red-500 flex-shrink-0" />
            ) : (
              <DownloadIcon className="w-6 text-green-500 flex-shrink-0" />
            )}
            <div className="overflow-hidden overflow-ellipsis text-left flex-1">
              {mockAddressBook[txn.account]?.displayName ?? txn.account}
            </div>
            <span className="flex-shrink-0 font-medium">
              Ӿ {txn.amount === '' ? '<.01' : txn.amount}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default RecentTransactions
