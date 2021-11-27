import { useEffect, useState } from 'react'

import fetcher from '../fetcher'
import { XnoPriceResponse } from '../types'

const useXnoPrice = () => {
  const [xnoPrice, setXnoPrice] = useState<number | undefined>()
  useEffect(() => {
    // todo get url out of here
    fetcher<XnoPriceResponse>('https://nano.to/price?json=true').then(res =>
      setXnoPrice(res.price)
    )
  }, [])
  return { xnoPrice, loading: xnoPrice === undefined }
}

export default useXnoPrice
