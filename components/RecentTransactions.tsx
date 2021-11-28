import { ClockIcon } from '@heroicons/react/outline'
import { DownloadIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { tools } from 'nanocurrency-web'
import type { FC } from 'react'

import { useCurrentAccount } from '../lib/context/accountContext'
import useAccountHistory from '../lib/hooks/useAccountHistory'
import useAccountReceivable from '../lib/hooks/useAccountReceivable'
import useReceiveNano from '../lib/hooks/useReceiveNano'

const rawToNanoDisplay = (raw: string) =>
  Number(tools.convert(raw, 'RAW', 'NANO').slice(0, 20))
    .toFixed(2)
    .replace(/^0\.00/, 'small')
    .replace('.00', '')

export interface Props {
  className?: string
}

const RecentTransactions: FC<Props> = ({ className }) => {
  const { receive } = useReceiveNano()

  const {
    accountReceivable,
    blocksInfo: receivableBlocksInfo,
    loading: loadingReceivable,
  } = useAccountReceivable()
  const { accountHistory, loading: loadingHistory } = useAccountHistory()

  const account = useCurrentAccount()

  const hasReceivable =
    !loadingReceivable && Object.keys(accountReceivable.blocks).length > 0
  const hasHistory = !loadingHistory && accountHistory.history.length > 0

  const receivable = Object.entries(
    accountReceivable?.blocks[account?.address ?? ''] ?? {}
  ).map(([hash, { amount, source }]) => ({
    hash,
    amount,
    from: source,
  }))

  return (
    <div className={clsx('flex flex-col gap-6 w-full', className)}>
      {hasReceivable && (
        <section className="flex flex-col gap-3 w-full items-center">
          <h2 className="text-2xl font-semibold text-purple-50">receivable</h2>
          <ol className="flex flex-col gap-3 w-full">
            {receivable.map(receivable => (
              <li
                key={receivable.hash}
                className="bg-purple-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4 border-blue-500"
              >
                <button
                  className="contents"
                  onClick={() => receive(receivable.hash, receivable.amount)}
                >
                  <ClockIcon className="w-6 flex-shrink-0 text-blue-500" />

                  <div className="overflow-hidden overflow-ellipsis text-left flex-1 whitespace-nowrap">
                    {Intl.DateTimeFormat([], {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    }).format(
                      Number(
                        receivableBlocksInfo!.blocks[receivable.hash]
                          .local_timestamp
                      ) * 1000
                    )}{' '}
                    - {<span className="text-xs">{receivable.from}</span>}
                  </div>
                  <span className="flex-shrink-0 font-medium">
                    Ӿ{' '}
                    {rawToNanoDisplay(receivable.amount) === 'small' ? (
                      '<.01'
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
      {hasHistory && hasReceivable && <hr />}
      {hasHistory && (
        <section className="flex flex-col gap-3 w-full items-center">
          <h2 className="text-2xl font-semibold text-purple-50">
            recent transactions
          </h2>
          <ol className="flex flex-col gap-3 w-full">
            {[
              {
                hash: 'string',
                send: 'string',
                receivable: true,
                amount: '0',
                account: '',
                timestamp: '',
              },
            ].map(txn => (
              <li
                key={txn.hash}
                className={clsx(
                  'bg-purple-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4',
                  txn.send
                    ? 'border-yellow-500'
                    : txn.receivable
                    ? 'border-blue-500'
                    : 'border-green-500'
                )}
              >
                <button className="contents" onClick={() => {}}>
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
                    }).format(Number(txn.timestamp) * 1000)}{' '}
                    - {<span className="text-xs">{txn.account}</span>}
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
        </section>
      )}
      {!hasReceivable && !hasHistory && (
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
