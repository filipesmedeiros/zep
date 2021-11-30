import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useSetupSeed from '../../../lib/hooks/useSetupSeed'

const New: NextPage = () => {
  const { lazy, seed, storeSeed } = useSetupSeed(true)
  const { push } = useRouter()
  const [storing, setStoring] = useState(false)
  useEffect(() => {
    if (seed !== undefined) {
      const copyAndGoToStore = async () => {
        await navigator.clipboard.writeText(seed.mnemonic)
        setStoring(true)
      }
      copyAndGoToStore()
    }
  }, [seed, push])

  const onStoreClick = async () => {
    await storeSeed()
    push('/welcome/new/done')
  }

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-2 text-purple-50">
      <h1 className="font-extrabold text-9xl">{!storing ? 1 : 2}</h1>
      {!storing ? (
        <>
          <p className="text-lg">
            generate a <b>passphrase</b> and copy it to your clipboard
          </p>
          <button
            className="px-5 py-2 text-xl font-bold text-gray-900 rounded dark:bg-gray-900 dark:text-purple-100 bg-purple-50"
            onClick={lazy}
          >
            generate passphrase
          </button>
          <p className="text-lg">
            <b>
              store this passphrase securely: you&apos;ll need it in case
              something happens to this device
            </b>
          </p>
        </>
      ) : (
        <>
          <p className="text-lg">
            store the <b>passphrase</b> securely in zep
          </p>
          <button
            className="px-5 py-2 text-xl font-bold text-gray-900 rounded dark:bg-gray-900 dark:text-purple-100 bg-purple-50"
            onClick={onStoreClick}
          >
            store passphrase
          </button>
          <aside className="text-xs">
            again, your passphrase will{' '}
            <b className="font-extrabold">
              <em>never</em>
            </b>{' '}
            leave your device, and will only be decrypted for a brief moment on
            each transaction
          </aside>
        </>
      )}
    </div>
  )
}

export default New
