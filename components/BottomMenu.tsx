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
        'flex w-full items-end transition-opacity',
        leftHanded ? 'flex-row-reverse' : 'flex-row',
        pathname === '/dashboard' ? 'justify-end' : 'justify-between',
        { 'opacity-50': isWelcoming },
        className
      )}
    >
      {pathname !== '/dashboard' && (
        <Link href="/dashboard">
          <a
            role="menuitem"
            className={clsx(
              'h-12 p-1 bg-purple-400 transition-colors rounded shadow hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default',
              { 'pointer-events-none': isWelcoming }
            )}
          >
            <span className="hidden">go back to the dashboard</span>
            <HomeIcon className="h-full text-purple-50 dark:text-gray-900 transition-colors" />
          </a>
        </Link>
      )}

      <div
        role="menuitem"
        className={clsx(
          'flex gap-4 xs:gap-6 items-end',
          leftHanded ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {'share' in navigator ? (
          <button
            aria-label="Share your nano address"
            disabled={isWelcoming}
            className="w-10 h-16 p-1 bg-purple-400 transition-colors rounded shadow hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default"
            onClick={onShare}
          >
            <ShareIcon className="text-purple-50 dark:text-gray-900 transition-colors" />
          </button>
        ) : (
          <button
            aria-label="Copy your nano address to the clipboard"
            disabled={isWelcoming || confirmCopyAddress}
            className={clsx(
              'p-1 h-16 w-10 rounded shadow transition-colors',
              confirmCopyAddress
                ? 'bg-purple-50'
                : 'bg-purple-400 hover:bg-purple-400 disabled:hover:bg-purple-400 disabled:cursor-default'
            )}
            onClick={onCopyAddress}
          >
            {confirmCopyAddress ? (
              <CheckIcon className="text-purple-400" />
            ) : (
              <DocumentDuplicateIcon className="text-purple-50 dark:text-gray-900 transition-colors" />
            )}
          </button>
        )}

        <div className={clsx('flex h-16', { 'flex-row-reverse': leftHanded })}>
          <Link href="/receive/qr">
            <a
              role="navigation"
              className={clsx(
                'bg-purple-400 transition-colors h-16 px-1 xs:px-2 w-10 xs:w-14 hover:bg-purple-400 disabled:hover:bg-purple-400 shadow disabled:cursor-default',
                leftHanded ? 'rounded-r' : 'rounded-l',
                { 'pointer-events-none': isWelcoming }
              )}
            >
              <span className="hidden">see your qrcode</span>
              <LoginIcon
                className={
                  'h-full text-purple-50 dark:text-gray-900 transition-colors w-full -rotate-child-90'
                }
              />
            </a>
          </Link>
          <div
            role="presentation"
            className="h-16 p-1 border-t-2 border-b-2 border-purple-400 shadow"
          >
            <QrcodeIcon className="h-full text-gray-900 dark:text-purple-100 transition-colors" />
          </div>
          <Link href="/send/qrOrAddress">
            <a
              role="navigation"
              className={clsx(
                'bg-purple-400 transition-colors h-16 px-1 xs:px-2 w-10 xs:w-14 hover:bg-purple-400 disabled:hover:bg-purple-400 shadow disabled:cursor-default',
                leftHanded ? 'rounded-l' : 'rounded-r',
                { 'pointer-events-none': isWelcoming }
              )}
            >
              <span className="hidden">send ӾNO</span>
              <PaperAirplaneIcon className="h-full text-purple-50 dark:text-gray-900 transition-colors w-full rotate-[30deg] translate-x-1 -translate-y-0.5" />
            </a>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default BottomMenu
