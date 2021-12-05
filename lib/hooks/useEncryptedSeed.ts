import { useEffect, useState } from 'react'

import { getEncryptedSeed } from '../db/encryptedSeeds'

const useEncryptedSeed = (id: 'os' | 'pin' = 'os') => {
  const [encryptedSeed, setEncryptedSeed] = useState({
    encryptedSeed: undefined as string | undefined,
    checking: true,
  })

  useEffect(() => {
    const setSeed = async () => {
      const encryptedSeed = (await getEncryptedSeed('os'))?.encryptedSeed
      setEncryptedSeed({ encryptedSeed, checking: false })
    }
    setSeed()
  }, [id])
  return encryptedSeed
}

export default useEncryptedSeed
