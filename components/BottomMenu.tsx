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
import { useAddress } from '../lib/context/addressContext'
import { usePreferences } from '../lib/context/preferencesContext'
import { getEncryptedSeed } from '../lib/db/encryptedSeeds'

export interface Props {
  className?: string
}

const BottomMenu: FC<Props> = ({ className }) => {
  const {
    preferences: { leftHanded },
  } = usePreferences()
  const { push, pathname } = useRouter()
  const { address } = useAddress()

  const [confirmCopyAddress, setConfirmCopyAddress] = useState(false)
  const [confirmCopySeed, setConfirmCopySeed] = useState(false)
  const onCopy = (seed?: string) => {
    if (address !== undefined || seed !== undefined) {
      navigator.clipboard.writeText(seed ?? address!)
      seed !== undefined
        ? setConfirmCopySeed(true)
        : setConfirmCopyAddress(true)
      setTimeout(
        () =>
          seed !== undefined
            ? setConfirmCopySeed(false)
            : setConfirmCopyAddress(false),
        1500
      )
    }
  }

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
          className="bg-purple-500 p-1 h-12 rounded hover:bg-purple-400 shadow-lg"
          onClick={() => push('/dashboard')}
        >
          <HomeIcon className="h-full text-white dark:text-gray-900" />
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
            className={clsx(
              'flex gap-6 items-end',
              leftHanded ? 'flex-row-reverse' : null
            )}
          >
            <div className="flex flex-col h-16 justify-between">
              <button
                disabled={confirmCopySeed}
                className={clsx(
                  'p-1 h-7 rounded shadow-lg',
                  confirmCopySeed
                    ? 'bg-white'
                    : 'bg-purple-500 hover:bg-purple-400'
                )}
                onClick={async () => {
                  const {
                    // @ts-expect-error
                    response: { signature: sig },
                  } = (await checkBiometrics())!

                  const encryptedSeed = (await getEncryptedSeed('os'))!
                  const decryptedSeed = AES.decrypt(
                    encryptedSeed.encryptedSeed,
                    sig.toString()
                  ).toString(enc.Utf8)
                  onCopy(decryptedSeed)
                }}
              >
                {confirmCopySeed ? (
                  <CheckIcon className="h-full text-purple-500" />
                ) : (
                  <KeyIcon className="h-full text-white dark:text-gray-900" />
                )}
              </button>
              <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
                <LibraryIcon className="h-full text-white dark:text-gray-900" />
              </button>
            </div>
            <div className="flex flex-col h-16 justify-between">
              <button
                disabled={confirmCopyAddress}
                className={clsx(
                  'p-1 h-7 rounded shadow-lg',
                  confirmCopyAddress
                    ? 'bg-white'
                    : 'bg-purple-500 hover:bg-purple-400'
                )}
                onClick={() => onCopy()}
              >
                {confirmCopyAddress ? (
                  <CheckIcon className="h-full text-purple-500" />
                ) : (
                  <DocumentDuplicateIcon className="h-full text-white dark:text-gray-900" />
                )}
              </button>
              <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
                <DownloadIcon className="h-full text-white dark:text-gray-900" />
              </button>
            </div>
          </div>

          <div className="relative h-16">
            <button
              className={clsx(
                'bg-purple-500 absolute top-0 h-16 w-7 rounded-r hover:bg-purple-400 shadow-md',
                leftHanded
                  ? 'left-0 -translate-x-2/3 rounded-l'
                  : 'right-0 translate-x-2/3 rounded-r'
              )}
              onClick={() => push('/readQrCode')}
            >
              <UploadIcon className="h-full text-white dark:text-gray-900 w-full" />
            </button>

            <div className="border-purple-500 border-t-2 border-b-2 py-1 px-3 h-16 shadow-lg">
              <QrcodeIcon className="h-full text-gray-900 dark:text-purple-100" />
            </div>

            <button
              className={clsx(
                'bg-purple-500 absolute top-0 h-16 w-7 hover:bg-purple-400 shadow-md',
                leftHanded
                  ? 'right-0 translate-x-2/3 rounded-r'
                  : 'left-0 -translate-x-2/3 rounded-l'
              )}
              onClick={() => push('/myQrCode')}
            >
              <DownloadIcon className="h-full text-white dark:text-gray-900 w-full" />
            </button>
          </div>

          <div className="flex flex-col h-16 justify-between">
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-md">
              <UploadIcon className="h-full text-white dark:text-gray-900" />
            </button>
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
              <RssIcon className="h-full text-white dark:text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
