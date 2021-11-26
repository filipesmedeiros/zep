import {
  CheckIcon,
  DocumentDuplicateIcon,
  DownloadIcon,
  HomeIcon,
  KeyIcon,
  LibraryIcon,
  QrcodeIcon,
  RssIcon,
  UploadIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { AES, enc } from 'crypto-js'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

import { checkBiometrics } from '../lib/biometrics'
import { useAccount, useAccounts } from '../lib/context/accountContext'
import { usePreferences } from '../lib/context/preferencesContext'
import { getEncryptedSeed } from '../lib/db/encryptedSeeds'
import decryptSeed from '../lib/decryptSeed'
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
  const [confirmCopySeed, setConfirmCopySeed] = useState(false)

  const onCopySeed = async () => {
    const seed = await decryptSeed('os')
    navigator.clipboard.writeText(seed)
    setConfirmCopySeed(true)
    setTimeout(() => setConfirmCopySeed(false), 1500)
  }

  const onCopyAddress = () => {
    if (account !== undefined) {
      navigator.clipboard.writeText(account.address)
      setConfirmCopyAddress(true)
      setTimeout(() => setConfirmCopyAddress(false), 1500)
    }
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
            'flex gap-8 items-end',
            leftHanded ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <div
            className={clsx('flex gap-6 items-end', {
              'flex-row-reverse': leftHanded,
            })}
          >
            <div className="flex flex-col h-16 justify-between">
              <button
                disabled={isWelcoming || confirmCopySeed}
                className={clsx(
                  'p-1 h-7 rounded shadow-lg',
                  confirmCopySeed
                    ? 'bg-purple-50'
                    : 'bg-purple-500 hover:bg-purple-400 disabled:hover:bg-purple-500 disabled:cursor-default'
                )}
                onClick={onCopySeed}
              >
                {confirmCopySeed ? (
                  <CheckIcon className="h-full text-purple-500" />
                ) : (
                  <KeyIcon className="h-full text-purple-50 dark:text-gray-900" />
                )}
              </button>
              <button
                disabled={isWelcoming}
                className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-lg disabled:cursor-default"
              >
                <LibraryIcon className="h-full text-purple-50 dark:text-gray-900" />
              </button>
            </div>
            <div className="flex flex-col h-16 justify-between">
              <button
                disabled={isWelcoming || confirmCopyAddress}
                className={clsx(
                  'p-1 h-7 rounded shadow-lg',
                  confirmCopyAddress
                    ? 'bg-purple-50'
                    : 'bg-purple-500 hover:bg-purple-400 disabled:hover:bg-purple-500 disabled:cursor-default'
                )}
                onClick={onCopyAddress}
              >
                {confirmCopyAddress ? (
                  <CheckIcon className="h-full text-purple-500" />
                ) : (
                  <DocumentDuplicateIcon className="h-full text-purple-50 dark:text-gray-900" />
                )}
              </button>
              <button
                disabled={isWelcoming}
                className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-lg disabled:cursor-default"
              >
                <DownloadIcon className="h-full text-purple-50 dark:text-gray-900" />
              </button>
            </div>
          </div>

          <div className="relative h-16">
            <button
              disabled={isWelcoming}
              className={clsx(
                'bg-purple-500 absolute top-0 h-16 w-7 rounded-r hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default',
                leftHanded
                  ? 'left-0 -translate-x-2/3 rounded-l'
                  : 'right-0 translate-x-2/3 rounded-r'
              )}
              onClick={() => push('/readQrCode')}
            >
              <UploadIcon className="h-full text-purple-50 dark:text-gray-900 w-full" />
            </button>

            <div className="border-purple-500 border-t-2 border-b-2 py-1 px-3 h-16 shadow-lg">
              <QrcodeIcon className="h-full text-gray-900 dark:text-purple-100" />
            </div>

            <button
              disabled={isWelcoming}
              className={clsx(
                'bg-purple-500 absolute top-0 h-16 w-7 hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default',
                leftHanded
                  ? 'right-0 translate-x-2/3 rounded-r'
                  : 'left-0 -translate-x-2/3 rounded-l'
              )}
              onClick={() => push('/myQrCode')}
            >
              <DownloadIcon className="h-full text-purple-50 dark:text-gray-900 w-full" />
            </button>
          </div>

          <div className="flex flex-col h-16 justify-between">
            <button
              disabled={isWelcoming}
              className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 disabled:hover:bg-purple-500 shadow-md disabled:cursor-default"
            >
              <UploadIcon className="h-full text-purple-50 dark:text-gray-900" />
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
