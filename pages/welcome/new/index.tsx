import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useSetupSeed from '../../../lib/hooks/useSetupSeed'

const New: NextPage = () => {
  const { lazy, seed, storeSeed } = useSetupSeed()
  const { push } = useRouter()
  const [storing, setStoring] = useState(false)
  useEffect(() => {
    const copyAndGoToStore = async () => {
      if (seed !== undefined) {
        await navigator.clipboard.writeText(seed.mnemonic)
        setStoring(true)
      }
    }
    copyAndGoToStore()
  }, [seed, push])

  return (
    <div className="flex flex-col h-full justify-start items-center text-center px-4 gap-2">
      <h1 className="text-9xl font-extrabold">{!storing ? 1 : 2}</h1>
      {!storing ? (
        <>
          <p className="text-lg">
            generate a <b>passphrase</b> and copy it to your clipboard
          </p>
          <button
            className="dark:bg-gray-900 dark:text-purple-100 py-2 px-5 rounded text-2xl"
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
            className="dark:bg-gray-900 dark:text-purple-100 py-2 px-5 rounded text-2xl"
            onClick={storeSeed}
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
