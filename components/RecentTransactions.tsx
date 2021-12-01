import { ChevronUpIcon, ClockIcon } from '@heroicons/react/outline'
import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useState } from 'react'

import useAccountHistory from '../lib/hooks/useAccountHistory'
import useAccountReceivable from '../lib/hooks/useAccountReceivable'
import useReceiveNano from '../lib/hooks/useReceiveNano'
import rawToNanoDisplay from '../lib/xno/rawToNanoDisplay'

export interface Props {
  className?: string
}

const RecentTransactions: FC<Props> = ({ className }) => {
  const { receive } = useReceiveNano()

  const { receivableBlocks, onBlockReceived } = useAccountReceivable()
  const { data: accountHistory } = useAccountHistory()

  const hasReceivable =
    receivableBlocks !== undefined && receivableBlocks.length > 0

  const [receivablesExpanded, setReceivablesExpanded] = useState(false)

  return (
    <>
      {hasReceivable && (
        <section className="flex flex-col w-full gap-3">
          <div className="flex items-center justify-between gap-1">
            <h2 className="flex-1 text-2xl font-semibold text-purple-50">
              incoming
            </h2>

            <span className="w-6 text-base text-center text-gray-900 rounded-full dark:bg-purple-50">
              {receivableBlocks.length}
            </span>
            <ChevronUpIcon
              onClick={() => setReceivablesExpanded(prev => !prev)}
              className={clsx(
                'h-8 transition-transform-child origin-center-child',
                {
                  '-rotate-child-180': receivablesExpanded,
                }
              )}
            />
          </div>
          <ol
            className={clsx(
              'flex flex-col gap-3 w-full overflow-auto transition-height duration-300',
              receivablesExpanded ? 'h-32' : 'h-0'
            )}
          >
            {receivableBlocks.map(receivable => (
              <li
                key={receivable.hash}
                className="flex items-center justify-between px-3 py-3 text-black border-r-4 border-yellow-400 rounded shadow bg-purple-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-purple-50 gap-2"
              >
                <button
                  className="contents"
                  onClick={async () => {
                    await receive(receivable.hash, receivable.amount)
                    onBlockReceived(receivable.hash)
                  }}
                >
                  <ClockIcon className="flex-shrink-0 w-6 text-yellow-400" />

                  <div className="overflow-hidden text-left overflow-ellipsis whitespace-nowrap">
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
      <section className="flex flex-col flex-1 w-full min-h-0 gap-3">
        <h2 className="text-2xl font-semibold text-purple-50">
          recent transactions
        </h2>
        {accountHistory !== undefined && accountHistory.history !== '' ? (
          <ol className="flex flex-col w-full overflow-auto gap-3">
            {accountHistory.history.map(txn => (
              <li
                key={txn.hash}
                className={clsx(
                  'bg-purple-50 dark:bg-gray-800 dark:text-purple-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4',
                  txn.type === 'send' ? 'border-yellow-300' : 'border-green-300'
                )}
              >
                <button className="contents" onClick={() => {}}>
                  {txn.type === 'send' ? (
                    <UploadIcon className="flex-shrink-0 w-6 text-yellow-300" />
                  ) : (
                    <DownloadIcon
                      className={clsx('w-6 flex-shrink-0 text-green-300')}
                    />
                  )}
                  <div className="flex-1 overflow-hidden text-left overflow-ellipsis whitespace-nowrap">
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
        ) : (
          <div className="pt-8 text-center text-purple-50">
            <p className="pb-4">no transactions yet...</p>
            <p>
              get your first nano
              <br />
              to see something here!
            </p>
          </div>
        )}
      </section>
      {false && (
        <button
          className="px-4 py-2 font-bold bg-purple-200 rounded shadow dark:text-gray-900"
          onClick={() => {}}
        >
          load more
        </button>
      )}
    </>
  )
}

export default RecentTransactions
