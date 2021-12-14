import { ChevronUpIcon, ClockIcon } from '@heroicons/react/outline'
import { DownloadIcon, RefreshIcon, UploadIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

import useAccountHistory from '../lib/hooks/useAccountHistory'
import useAccountReceivable from '../lib/hooks/useAccountReceivable'
import useChallenge from '../lib/hooks/useChallenge'
import useContacts from '../lib/hooks/useContacts'
import useCredentialId from '../lib/hooks/useCredentialId'
import useReceiveNano from '../lib/hooks/useReceiveNano'
import showNotification from '../lib/showNotification'
import rawToNanoDisplay from '../lib/xno/rawToNanoDisplay'

export interface Props {}

const RecentTransactions: FC<Props> = () => {
  const { receive } = useReceiveNano()
  const { data: contacts } = useContacts()
  const findContact = (findAddress: string) =>
    contacts?.find(({ address }) => address === findAddress)?.name

  const { receivableBlocks, onBlockReceived } = useAccountReceivable()
  const {
    accountHistory,
    loadMore,
    hasMore,
    loading: loadingHistory,
    hasHistory,
    revalidate: refetchHistory,
  } = useAccountHistory()

  const hasReceivable =
    receivableBlocks !== undefined && receivableBlocks.length > 0

  const [receivablesExpanded, setReceivablesExpanded] = useState(false)

  const mappedHistory = (accountHistory ?? []).flatMap(historyPage =>
    historyPage.history !== '' ? historyPage.history : []
  )

  const initialLoadingHistory = loadingHistory && accountHistory === undefined

  const [refetchingHistory, setRefectingHistory] = useState(false)
  useEffect(() => {
    if (!loadingHistory && accountHistory !== undefined)
      setRefectingHistory(false)
  }, [loadingHistory, accountHistory])

  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const onIncomingClick = async (receivable: {
    hash: string
    amount: string
    from: string
    timestamp: string
  }) => {
    await receive(receivable.hash, receivable.amount, {
      challenge: challenge!,
      rawId: credentialId!,
    })
    onBlockReceived(receivable.hash)
    refetchHistory()

    showNotification({
      title: 'received!',
      body: `received Ӿ${convert(receivable.amount, {
        from: Unit.raw,
        to: Unit.Nano,
      })} from ${receivable.from}`,
      tag: 'received',
    })
  }

  return (
    <>
      {hasReceivable && (
        <section className="flex flex-col w-full gap-3">
          <div
            className="flex items-center justify-between gap-1 hover:cursor-pointer"
            onClick={() => setReceivablesExpanded(prev => !prev)}
          >
            <h1 className="flex-1 text-2xl font-semibold transition-colors text-gray-900 dark:text-primary-50">
              incoming
            </h1>

            <span className="w-6 text-base text-center dark:text-gray-900 text-primary-50 rounded-full bg-primary-400 dark:bg-primary-50">
              {receivableBlocks.length}
            </span>
            <ChevronUpIcon
              className={clsx(
                'h-8 motion-safe:transition-transform-child origin-center-child',
                {
                  '-rotate-child-180': receivablesExpanded,
                }
              )}
            />
          </div>
          <ol
            className={clsx(
              'flex flex-col gap-3 w-full overflow-auto motion-safe:transition-all motion-safe:duration-300 px-1',
              receivablesExpanded ? 'max-h-32 pb-1' : 'max-h-0'
            )}
          >
            {receivableBlocks.map(receivable => (
              <li
                key={receivable.hash}
                className="flex items-center justify-between px-3 py-3 text-black border-r-4 border-orange-400 rounded shadow bg-gray-50 transition-colors dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-primary-50 gap-2"
              >
                <button
                  aria-label={`Receive transaction from ${
                    findContact(receivable.from) ?? receivable.from
                  }`}
                  className="contents"
                  onClick={() => onIncomingClick(receivable)}
                >
                  <ClockIcon className="flex-shrink-0 w-6 text-orange-400" />

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
        <div className="flex items-center justify-between gap-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-primary-50">
            recent transactions
          </h1>
          {hasHistory && (
            <button
              aria-label="Refresh transaction history"
              onClick={() => {
                setRefectingHistory(true)
                refetchHistory()
              }}
            >
              <RefreshIcon className="h-6" />
            </button>
          )}
        </div>
        {initialLoadingHistory || refetchingHistory ? (
          <ul className="flex flex-col w-full overflow-auto px-0.5 pb-0.5 gap-2">
            <li className="bg-gray-100 dark:bg-gray-800 shadow rounded h-12 motion-safe:animate-pulse" />
            <li className="bg-gray-100 dark:bg-gray-800 shadow rounded h-12 motion-safe:animate-pulse" />
            <li className="bg-gray-100 dark:bg-gray-800 shadow rounded h-12 motion-safe:animate-pulse" />
            <li className="bg-gray-100 dark:bg-gray-800 shadow rounded h-12 motion-safe:animate-pulse" />
          </ul>
        ) : hasHistory ? (
          <ol className="flex flex-col w-full overflow-auto px-0.5 pb-0.5 gap-2">
            {mappedHistory.map(txn => (
              <li
                key={txn.hash}
                className={clsx(
                  'bg-gray-50 dark:bg-gray-800 dark:text-primary-50 shadow rounded px-3 py-3 flex items-center justify-between gap-2 text-black border-r-4 transition-colors',
                  txn.type === 'send' ? 'border-orange-300' : 'border-sky-300'
                )}
              >
                <Link href={`/transaction/${txn.hash}`}>
                  <a className="contents pointer-events-none">
                    <span className="hidden">
                      see {txn.hash} transaction details
                    </span>
                    {txn.type === 'send' ? (
                      <UploadIcon className="flex-shrink-0 w-6 text-orange-300" />
                    ) : (
                      <DownloadIcon
                        className={clsx('w-6 flex-shrink-0 text-sky-300')}
                      />
                    )}
                    <div className="flex-1 overflow-hidden text-left overflow-ellipsis whitespace-nowrap">
                      {Intl.DateTimeFormat([], {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      }).format(Number(txn.local_timestamp) * 1000)}{' '}
                      -{' '}
                      {
                        <span className="text-xs">
                          {findContact(txn.account) ?? txn.account}
                        </span>
                      }
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
                  </a>
                </Link>
              </li>
            ))}
            {hasMore && (
              <button
                aria-label="Load more transactions"
                className="px-4 py-1.5 font-bold transition-colors bg-primary-400 rounded text-primary-50 shadow dark:text-gray-900 place-self-center"
                onClick={loadMore}
              >
                load more
              </button>
            )}
          </ol>
        ) : (
          <div className="pt-8 text-center text-xl text-gray-900 dark:text-primary-50">
            <p className="pb-4">no transactions yet...</p>
            <p>
              get your first nano
              <br />
              to see something here!
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default RecentTransactions
