import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ClipboardCopyIcon,
  DownloadIcon,
  HomeIcon,
  LibraryIcon,
  QrcodeIcon,
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
            'flex gap-5 items-end',
            leftHanded ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
            <LibraryIcon className="h-full text-white" />
          </button>

          <div
            className={clsx(
              'flex gap-2',
              leftHanded ? 'flex-row-reverse' : null
            )}
          >
            <div className="flex flex-col justify-between">
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
                  <ClipboardCopyIcon className="h-full text-white" />
                )}
              </button>
              <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
                <DownloadIcon className="h-full text-white" />
              </button>
            </div>
            <button
              className="bg-purple-500 p-1 h-16 rounded hover:bg-purple-400 shadow-lg"
              onClick={() => push('/myQrCode')}
            >
              <QrcodeIcon className="h-full text-white" />
            </button>
          </div>

          <div
            className={clsx(
              'flex gap-2 items-end',
              leftHanded ? 'flex-row-reverse' : null
            )}
          >
            <button
              className="bg-purple-500 p-1 h-16 rounded hover:bg-purple-400 shadow-lg"
              onClick={() => push('/readQrCode')}
            >
              <CameraIcon className="h-full text-white" />
            </button>
            <button className="bg-purple-500 p-1 h-16 w-8 rounded hover:bg-purple-400 shadow-lg">
              <UploadIcon className="w-full text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomMenu
