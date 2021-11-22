import {
  CameraIcon,
  ClipboardCopyIcon,
  DownloadIcon,
  QrcodeIcon,
  UploadIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import type { FC } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'

export interface Props {
  className?: string
}

const TransactionMenu: FC<Props> = ({ className }) => {
  const {
    preferences: { leftHanded },
  } = usePreferences()
  return (
    <div
      className={clsx(
        'flex w-full',
        leftHanded ? 'justify-start' : 'justify-end',
        className
      )}
    >
      <div
        className={clsx(
          'flex gap-5 items-end',
          leftHanded ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div
          className={clsx('flex gap-2', leftHanded ? 'flex-row-reverse' : null)}
        >
          <div className="flex flex-col justify-between">
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
              <ClipboardCopyIcon className="h-full text-white" />
            </button>
            <button className="bg-purple-500 p-1 h-7 rounded hover:bg-purple-400 shadow-lg">
              <DownloadIcon className="h-full text-white" />
            </button>
          </div>
          <button className="bg-purple-500 p-1 h-16 rounded hover:bg-purple-400 shadow-lg">
            <QrcodeIcon className="h-full text-white" />
          </button>
        </div>

        <div
          className={clsx(
            'flex gap-2 items-end',
            leftHanded ? 'flex-row-reverse' : null
          )}
        >
          <button className="bg-purple-500 p-1 h-16 rounded hover:bg-purple-400 shadow-lg">
            <CameraIcon className="h-full text-white" />
          </button>
          <button className="bg-purple-500 p-1 h-16 w-8 rounded hover:bg-purple-400 shadow-lg">
            <UploadIcon className="w-full text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionMenu
