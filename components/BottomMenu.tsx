import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ClipboardCopyIcon,
  DocumentDuplicateIcon,
  DownloadIcon,
  HomeIcon,
  LibraryIcon,
  QrcodeIcon,
  RssIcon,
  UploadIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

import { useAddress } from '../lib/context/addressContext'
import { usePreferences } from '../lib/context/preferencesContext'

export interface Props {
  className?: string
}

const BottomMenu: FC<Props> = ({ className }) => {
  const {
    preferences: { leftHanded },
  } = usePreferences()
  const { push } = useRouter()
  const { address } = useAddress()

  const [confirmCopy, setConfirmCopy] = useState(false)
  const onCopy = () => {
    if (address !== undefined) {
      navigator.clipboard.writeText(address)
      setConfirmCopy(true)
      setTimeout(() => setConfirmCopy(false), 1500)
    }
  }

  return (
    <div className={clsx('flex w-full justify-between items-end', className)}>
      <button
        className="bg-purple-500 p-1 h-12 rounded hover:bg-purple-400 shadow-lg"
        onClick={() => push('/dashboard')}
      >
        <HomeIcon className="h-full text-white" />
      </button>

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
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
              <LibraryIcon className="h-full text-white" />
            </button>
            <div className="flex flex-col h-16 justify-between">
              <button
                className={clsx(
                  'p-1 h-7 rounded shadow-lg',
                  confirmCopy ? 'bg-white' : 'bg-purple-500 hover:bg-purple-400'
                )}
                onClick={onCopy}
              >
                {confirmCopy ? (
                  <CheckIcon className="h-full text-purple-500" />
                ) : (
                  <DocumentDuplicateIcon className="h-full text-white" />
                )}
              </button>
              <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
                <DownloadIcon className="h-full text-white" />
              </button>
            </div>
          </div>

          <div className="relative h-16">
            <button
              className="bg-purple-500 absolute top-0 right-0 p-1 h-16 w-7 rounded-r hover:bg-purple-400 shadow-md translate-x-2/3"
              onClick={() => push('/readQrCode')}
            >
              <UploadIcon className="h-full text-white w-full" />
            </button>

            <div className="border-purple-500 border-t-2 border-b-2 py-1 px-3 h-16 shadow-lg">
              <QrcodeIcon className="h-full text-purple-500 dark:text-white" />
            </div>

            <button
              className="bg-purple-500 absolute bottom-0 left-0 p-1 h-16 w-7 rounded-l hover:bg-purple-400 shadow-md -translate-x-2/3"
              onClick={() => push('/myQrCode')}
            >
              <DownloadIcon className="h-full text-white w-full" />
            </button>
          </div>

          <div className="flex flex-col h-16 justify-between">
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-md">
              <UploadIcon className="h-full text-white" />
            </button>
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
              <RssIcon className="h-full text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
