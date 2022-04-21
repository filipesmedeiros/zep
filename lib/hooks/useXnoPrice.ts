import { useEffect, useState } from 'react'

import fetcher from '../fetcher'
import { XnoPriceResponse } from '../types'

type ReturnValue =
  | {
      xnoPrice: undefined
      loading: true
    }
  | { xnoPrice: number; loading: false }

const useXnoPrice = (): ReturnValue => {
  const [xnoPrice, setXnoPrice] = useState<number | undefined>()
  useEffect(() => {
    // todo get url out of here
    fetcher<XnoPriceResponse>(
      'https://nano.to/price?currency=EUR&json=true'
    ).then(res => setXnoPrice(res.price))
  }, [])
  const loading = xnoPrice === undefined
  return { xnoPrice, loading } as ReturnValue
}

export default useXnoPrice
