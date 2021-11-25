import { useEffect, useState } from 'react'

import { useAddress } from '../context/addressContext'

const useListenToTxn = () => {
  const { address } = useAddress()
  const [mostRecentTxn, setMostRecentTxn] = useState<any | undefined>(undefined)
  useEffect(() => {
    if (address !== undefined) {
      const ws = new WebSocket('wss://ws.mynano.ninja/')

      ws.onopen = () => {
        console.log('subscribed')
        ws.send(
          JSON.stringify({
            action: 'subscribe',
            topic: 'confirmation',
            options: {
              accounts: [address],
            },
          })
        )
        ws.addEventListener('message', ({ data }) => {
          const parsed = JSON.parse(data)
          console.log(parsed)
          setMostRecentTxn(parsed)
        })
      }

      return () => ws.close()
    }
  }, [address])
  return mostRecentTxn
}

export default useListenToTxn
