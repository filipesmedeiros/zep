import { useEffect, useState } from 'react'

import getIsiOS from '../isiOS'

const useIsiOS = () => {
  const [isiOS, setIsiOS] = useState(false)
  useEffect(() => {
    setIsiOS(getIsiOS())
  }, [])
  return isiOS
}

export default useIsiOS
