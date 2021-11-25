import { useEffect, useState } from 'react'

import { useAccounts } from '../context/accountContext'

const useListenToTxn = () => {
  const { accounts } = useAccounts()
  const [mostRecentTxn, setMostRecentTxn] = useState<any | undefined>(undefined)
  useEffect(() => {
    if (accounts !== undefined) {
      const ws = new WebSocket('wss://ws.mynano.ninja/')

      ws.onopen = () => {
        console.log('subscribed')
        ws.send(
          JSON.stringify({
            action: 'subscribe',
            topic: 'confirmation',
            options: {
              accounts: [accounts],
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
  }, [accounts])
  return mostRecentTxn
}

export default useListenToTxn
