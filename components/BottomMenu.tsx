import { LoginIcon, PaperAirplaneIcon } from '@heroicons/react/outline'
import {
  CheckIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  ShareIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

import { useAccount } from '../lib/context/accountContext'
import { usePreferences } from '../lib/context/preferencesContext'
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

  return (
    <footer
      role="navigation"
      className={clsx(
        'flex w-full items-end transition-opacity gap-2',
        leftHanded ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {pathname !== '/dashboard' && (
        <ButtonLink
          href="/dashboard"
          aria-label="go back to the dashboard"
          variant="primary"
        >
          <HomeIcon className="h-8" />
        </ButtonLink>
      )}

      {'share' in navigator ? (
        <Button
          variant="primary"
          aria-label="Share your nano address"
          onClick={onShare}
        >
          <ShareIcon className="h-8 transition-colors" />
        </Button>
      ) : (
        <Button
          variant="primary"
          aria-label="Copy your nano address to the clipboard"
          disabled={confirmCopyAddress}
          className={clsx({
            '!bg-purple-50 !text-purple-400': confirmCopyAddress,
          })}
          onClick={!confirmCopyAddress ? onCopyAddress : undefined}
        >
          {confirmCopyAddress ? (
            <CheckIcon className="h-8" />
          ) : (
            <DocumentDuplicateIcon className="h-8" />
          )}
        </Button>
      )}

      {!pathname.startsWith('/receive') && (
        <ButtonLink
          variant="primary"
          href="/receive/qr"
          aria-label="see your qrcode"
          className="xs:px-2 flex items-center flex-1"
        >
          <LoginIcon className="transition-colors stroke-2 h-8 -rotate-child-90" />
        </ButtonLink>
      )}

      {!pathname.startsWith('/send') && (
        <ButtonLink
          variant="primary"
          href="/send/to"
          aria-label="send ӾNO"
          className="xs:px-2 flex items-center flex-1"
        >
          <PaperAirplaneIcon className="h-8 transition-colors rotate-[30deg] translate-x-1 -translate-y-0.5" />
        </ButtonLink>
      )}
    </footer>
  )
}

export default BottomMenu
