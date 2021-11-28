import { useEffect } from 'react'

import { useAccounts } from '../context/accountContext'
import { ConfirmationMessage } from '../types'

const useListenToTxn = (
  onConfirmation: (confirmation: ConfirmationMessage) => void
) => {
  const { accounts } = useAccounts()
  useEffect(() => {
    if (accounts !== undefined) {
      const ws = new WebSocket('wss://ws.mynano.ninja/')

      ws.onopen = () => {
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
          const parsed = JSON.parse(data) as ConfirmationMessage
          onConfirmation(parsed)
        })
      }

      return () => ws.close()
    }
  }, [accounts, onConfirmation])
}

export default useListenToTxn
