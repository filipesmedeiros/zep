import type { NextPage } from 'next'
import { useEffect } from 'react'

import useSetupSeed from '../../lib/hooks/useSetupSeed'

const New: NextPage = () => {
  const { seedIsThere, lazy, seed } = useSetupSeed()
  useEffect(() => {
    if (seed !== undefined) {
      navigator.clipboard.writeText(seed)
    }
  }, [seed])
  return (
    <div className="flex flex-col h-full justify-center items-center text-center">
      <p className="text-xl mb-4">
        when you see this,
        <br />
        your new seed is probably already created and stored securely on your
        device!
      </p>
      <p>
        <b>it should also be on your clipboard. please store it securely</b>
      </p>
      <p className="mb-2">if not, give it another go:</p>
      <button
        className="dark:bg-gray-900 bg-white dark:hover:bg-gray-800 py-2 px-5 rounded text-sm w-40 font-bold shadow-lg hover:shadow-md active:shadow transition-all duration-100"
        onClick={lazy}
      >
        generate seed
      </button>

      <p>check here:</p>
      <p>{seedIsThere ? 'seed is there!' : 'seed is not there!'}</p>
    </div>
  )
}

export default New
