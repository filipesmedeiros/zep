import { useEffect, useState } from 'react'

import { openDb } from '../db'

const useSetupDb = (version = 1) => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // todo catch error
    openDb(version).then(() => setReady(true))
  }, [version])
  return ready
}

export default useSetupDb
