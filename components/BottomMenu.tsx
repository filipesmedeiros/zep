import { LoginIcon, PaperAirplaneIcon } from '@heroicons/react/outline'
import {
  CheckIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  QrcodeIcon,
  RssIcon,
  ShareIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

import { useAccount } from '../lib/context/accountContext'
import { usePreferences } from '../lib/context/preferencesContext'
import useIsWelcoming from '../lib/hooks/useIsWelcoming'

export interface Props {
  className?: string
}

const BottomMenu: FC<Props> = ({ className }) => {
  const {
    preferences: { leftHanded },
  } = usePreferences()
  const { push, pathname } = useRouter()
  const account = useAccount()

  const [confirmCopyAddress, setConfirmCopyAddress] = useState(false)
  const onCopyAddress = () => {
    if (account !== undefined) {
      navigator.clipboard.writeText(account.address)
      setConfirmCopyAddress(true)
      setTimeout(() => setConfirmCopyAddress(false), 1500)
    }
  }

  const onShare = () => {
    navigator.share({
      title: 'This is my nano address!',
      text: account?.address,
    })
  }

  const isWelcoming = useIsWelcoming()

  return (
    <div
      className={clsx(
        'flex w-full items-end',
        leftHanded ? 'flex-row-reverse' : 'flex-row',
        pathname === '/dashboard' ? 'justify-end' : 'justify-between',
        className
      )}
    >
      {pathname !== '/dashboard' && (
        <button
          disabled={isWelcoming}
          className="bg-purple-500 p-1 h-12 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-lg disabled:cursor-default"
          onClick={() => push('/dashboard')}
        >
          <HomeIcon className="h-full text-purple-50 dark:text-gray-900" />
        </button>
      )}

      <div>
        <div
          className={clsx(
            'flex gap-10 items-end',
            leftHanded ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {'share' in navigator ? (
            <button
              disabled={isWelcoming}
              className="p-1 h-16 w-10 rounded shadow-lg bg-purple-500 hover:bg-purple-400 disabled:hover:bg-purple-500 disabled:cursor-default"
              onClick={onShare}
            >
              <ShareIcon className="text-purple-50 dark:text-gray-900" />
            </button>
          ) : (
            <button
              disabled={isWelcoming || confirmCopyAddress}
              className={clsx(
                'p-1 h-16 w-10 rounded shadow-lg',
                confirmCopyAddress
                  ? 'bg-purple-50'
                  : 'bg-purple-500 hover:bg-purple-400 disabled:hover:bg-purple-500 disabled:cursor-default'
              )}
              onClick={onCopyAddress}
            >
              {confirmCopyAddress ? (
                <CheckIcon className="text-purple-500" />
              ) : (
                <DocumentDuplicateIcon className="text-purple-50 dark:text-gray-900" />
              )}
            </button>
          )}

          <div className="relative h-16">
            <button
              disabled={isWelcoming}
              className={clsx(
                'bg-purple-500 absolute top-0 px-1 h-16 w-10 rounded-r hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default',
                leftHanded
                  ? 'left-0 -translate-x-2/3 rounded-l'
                  : 'right-0 translate-x-2/3 rounded-r'
              )}
              onClick={() => push('/send/qr')}
            >
              <PaperAirplaneIcon className="h-full text-purple-50 dark:text-gray-900 w-full rotate-[30deg] translate-x-1" />
            </button>

            <div className="border-purple-500 border-t-2 border-b-2 py-1 px-4 h-16 shadow-lg">
              <QrcodeIcon className="h-full text-gray-900 dark:text-purple-100" />
            </div>

            <button
              disabled={isWelcoming}
              className={clsx(
                'bg-purple-500 absolute top-0 px-1 h-16 w-10 hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default',
                leftHanded
                  ? 'right-0 translate-x-2/3 rounded-r'
                  : 'left-0 -translate-x-2/3 rounded-l'
              )}
              onClick={() => push('/receive/qr')}
            >
              <LoginIcon
                className={
                  'h-full text-purple-50 dark:text-gray-900 w-full -rotate-child-90'
                }
              />
            </button>
          </div>

          <div className="flex flex-col h-16 justify-between">
            <button
              disabled={isWelcoming}
              className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default"
            >
              <PaperAirplaneIcon className="h-full text-purple-50 dark:text-gray-900 rotate-[30deg] translate-x-[2px]" />
            </button>
            <button
              disabled={isWelcoming}
              className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-lg disabled:cursor-default"
            >
              <RssIcon className="h-full text-purple-50 dark:text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
