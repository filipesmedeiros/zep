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
import Link from 'next/link'
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
    <footer
      role="menubar"
      className={clsx(
        'flex w-full items-end',
        leftHanded ? 'flex-row-reverse' : 'flex-row',
        pathname === '/dashboard' ? 'justify-end' : 'justify-between',
        className
      )}
    >
      {pathname !== '/dashboard' && (
        <Link href={isWelcoming ? '#' : '/dashboard'}>
          <a className="h-12 p-1 bg-purple-400 rounded shadow-lg hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default">
            <HomeIcon className="h-full text-purple-50 dark:text-gray-900" />
          </a>
        </Link>
      )}

      <div>
        <div
          className={clsx(
            'flex gap-6 items-end',
            leftHanded ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {'share' in navigator ? (
            <button
              disabled={isWelcoming}
              className="w-10 h-16 p-1 bg-purple-400 rounded shadow-lg hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default"
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
                  : 'bg-purple-400 hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default'
              )}
              onClick={onCopyAddress}
            >
              {confirmCopyAddress ? (
                <CheckIcon className="text-purple-400" />
              ) : (
                <DocumentDuplicateIcon className="text-purple-50 dark:text-gray-900" />
              )}
            </button>
          )}

          <div
            className={clsx('flex h-16', { 'flex-row-reverse': leftHanded })}
          >
            <Link href={isWelcoming ? '#' : '/receive/qr'}>
              <a
                className={clsx(
                  'bg-purple-400 px-1 h-16 w-10 hover:bg-purple-400 disabled:hover:bg-purple-400 shadow-md disabled:cursor-default',
                  leftHanded ? 'rounded-r' : 'rounded-l'
                )}
              >
                <LoginIcon
                  className={
                    'h-full text-purple-50 dark:text-gray-900 w-full -rotate-child-90'
                  }
                />
              </a>
            </Link>
            <div className="h-16 p-1 border-t-2 border-b-2 border-purple-400 shadow-lg">
              <QrcodeIcon className="h-full text-gray-900 dark:text-purple-100" />
            </div>
            <Link href={isWelcoming ? '#' : '/send/qr'}>
              <a
                className={clsx(
                  'bg-purple-400 px-1 h-16 w-10 hover:bg-purple-400 disabled:hover:bg-purple-400 shadow-md disabled:cursor-default',
                  leftHanded ? 'rounded-l' : 'rounded-r'
                )}
              >
                <PaperAirplaneIcon className="h-full text-purple-50 dark:text-gray-900 w-full rotate-[30deg] translate-x-1" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default BottomMenu
