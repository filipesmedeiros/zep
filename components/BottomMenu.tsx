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
import Button from './Button'
import ButtonLink from './ButtonLink'

export interface Props {
  className?: string
}

const BottomMenu: FC<Props> = ({ className }) => {
  const {
    preferences: { leftHanded },
  } = usePreferences()
  const { pathname } = useRouter()
  const account = useAccount()

  const [confirmCopyAddress, setConfirmCopyAddress] = useState(false)
  const onCopyAddress = () => {
    if (account !== undefined) {
      navigator.clipboard.writeText(account.address)
      setConfirmCopyAddress(true)
      setTimeout(() => setConfirmCopyAddress(false), 1500)
    }
  }

  const onShare = () =>
    navigator.share({
      title: 'This is my nano address!',
      text: account?.address,
    })

  const isWelcoming = useIsWelcoming()

  return (
    <footer
      role="navigation"
      className={clsx(
        'flex w-full items-end transition-opacity gap-2',
        leftHanded ? 'flex-row-reverse' : 'flex-row',
        pathname === '/dashboard' ? 'justify-end' : 'justify-between',
        { 'opacity-50': isWelcoming },
        className
      )}
    >
      {pathname !== '/dashboard' && (
        <ButtonLink
          href="/dashboard"
          aria-label="go back to the dashboard"
          variant="primary"
          disabled={isWelcoming}
        >
          <HomeIcon className="w-10" />
        </ButtonLink>
      )}

      <div
        className={clsx('flex gap-4 xs:gap-6 items-end', {
          'flex-row-reverse': leftHanded,
        })}
      >
        {'share' in navigator ? (
          <Button
            variant="primary"
            aria-label="Share your nano address"
            disabled={isWelcoming}
            onClick={onShare}
          >
            <ShareIcon className="w-8 transition-colors" />
          </Button>
        ) : (
          <Button
            variant="primary"
            aria-label="Copy your nano address to the clipboard"
            disabled={isWelcoming || confirmCopyAddress}
            className={clsx({
              '!bg-primary-50 !text-primary-400': confirmCopyAddress,
            })}
            onClick={
              !(isWelcoming || confirmCopyAddress) ? onCopyAddress : undefined
            }
          >
            {confirmCopyAddress ? (
              <CheckIcon className="w-8" />
            ) : (
              <DocumentDuplicateIcon className="w-8" />
            )}
          </Button>
        )}

        <nav className={clsx('flex h-16', { 'flex-row-reverse': leftHanded })}>
          <ButtonLink
            variant="primary"
            href="/receive/qr"
            aria-label="see your qrcode"
            disabled={isWelcoming}
            className={clsx(
              'xs:px-2 flex items-center',
              leftHanded ? 'rounded-l-none' : 'rounded-r-none'
            )}
          >
            <LoginIcon className="transition-colors stroke-2 w-10 -rotate-child-90" />
          </ButtonLink>

          <div
            role="presentation"
            className="p-1 border-t-2 border-b-2 border-primary-400 shadow w-16"
          >
            <QrcodeIcon className="h-full text-gray-900 dark:text-primary-100 transition-colors w-full" />
          </div>

          <ButtonLink
            variant="primary"
            href="/send/to"
            aria-label="send ӾNO"
            disabled={isWelcoming}
            className={clsx(
              'xs:px-2 flex items-center',
              leftHanded ? 'rounded-r-none' : 'rounded-l-none',
              { 'pointer-events-none': isWelcoming }
            )}
          >
            <PaperAirplaneIcon className="w-10 transition-colors rotate-[30deg] translate-x-1 -translate-y-0.5" />
          </ButtonLink>
        </nav>
      </div>
    </footer>
  )
}

export default BottomMenu
