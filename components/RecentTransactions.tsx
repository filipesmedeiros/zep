import { ClockIcon } from '@heroicons/react/outline'
import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useCallback, useState } from 'react'
import type { FC } from 'react'

import { useCurrentAccount } from '../lib/context/accountContext'
import useAccountHistory from '../lib/hooks/useAccountHistory'
import useAccountReceivable from '../lib/hooks/useAccountReceivable'
import useReceiveNano from '../lib/hooks/useReceiveNano'
import rawToNanoDisplay from '../lib/xno/rawToNanoDisplay'

export interface Props {
  className?: string
}

const RecentTransactions: FC<Props> = ({ className }) => {
  const account = useCurrentAccount()
  const { receive } = useReceiveNano()

  const { receivableBlocks, onBlockReceived } = useAccountReceivable()
  const { data: accountHistory } = useAccountHistory()

  const hasReceivable =
    receivableBlocks !== undefined && receivableBlocks.length > 0

  return (
    <div className={clsx('flex flex-col gap-6 w-full', className)}>
      {hasReceivable && (
        <section className="flex flex-col gap-3 w-full items-center">
          <h2 className="text-2xl font-semibold text-purple-50">receivable</h2>
          <ol className="flex flex-col gap-3 w-full">
            {receivableBlocks.map(receivable => (
              <li
                key={receivable.hash}
                className="bg-purple-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4 border-blue-500"
              >
                <button
                  className="contents"
                  onClick={async () => {
                    await receive(receivable.hash, receivable.amount)
                    onBlockReceived(receivable.hash)
                  }}
                >
                  <ClockIcon className="w-6 flex-shrink-0 text-blue-500" />

                  <div className="overflow-hidden overflow-ellipsis text-left flex-1 whitespace-nowrap">
                    {Intl.DateTimeFormat([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    }).format(Number(receivable.timestamp) * 1000)}{' '}
                    - {<span className="text-xs">{receivable.from}</span>}
                  </div>
                  <span className="flex-shrink-0 font-medium">
                    Ӿ{' '}
                    {rawToNanoDisplay(receivable.amount) === 'small' ? (
                      '<0.01'
                    ) : rawToNanoDisplay(receivable.amount).startsWith('0.') ? (
                      <>
                        <span className="text-sm font-semibold">0</span>
                        {rawToNanoDisplay(receivable.amount).substring(1)}
                      </>
                    ) : (
                      rawToNanoDisplay(receivable.amount)
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
      {accountHistory !== undefined &&
        accountHistory.history !== '' &&
        hasReceivable && <hr />}
      {accountHistory !== undefined && accountHistory.history !== '' && (
        <section className="flex flex-col gap-3 w-full items-center">
          <h2 className="text-2xl font-semibold text-purple-50">
            recent transactions
          </h2>
          <ol className="flex flex-col gap-3 w-full">
            {accountHistory.history.map(txn => (
              <li
                key={txn.hash}
                className={clsx(
                  'bg-purple-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4',
                  txn.type === 'send' ? 'border-yellow-500' : 'border-green-500'
                )}
              >
                <button className="contents" onClick={() => {}}>
                  {txn.type === 'send' ? (
                    <UploadIcon className="w-6 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <DownloadIcon
                      className={clsx('w-6 flex-shrink-0 text-green-500')}
                    />
                  )}
                  <div className="overflow-hidden overflow-ellipsis text-left flex-1 whitespace-nowrap">
                    {Intl.DateTimeFormat([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    }).format(Number(txn.local_timestamp) * 1000)}{' '}
                    - {<span className="text-xs">{txn.account}</span>}
                  </div>
                  <span className="flex-shrink-0 font-medium">
                    Ӿ{' '}
                    {rawToNanoDisplay(txn.amount) === 'small' ? (
                      '<0.01'
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
        </section>
      )}
      {!hasReceivable &&
        (accountHistory === undefined || accountHistory.history === '') && (
          <div className="text-center pt-8 text-purple-50">
            <p className="pb-4">no transactions yet...</p>
            <p>
              get your first nano
              <br />
              to see something here!
            </p>
          </div>
        )}
      {false && (
        <button
          className="bg-purple-200 py-2 px-4 rounded dark:text-gray-900 font-bold shadow"
          onClick={() => {}}
        >
          load more
        </button>
      )}
    </div>
  )
}

export default RecentTransactions
