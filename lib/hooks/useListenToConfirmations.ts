import { useEffect, useRef } from 'react'

import { useCurrentAccount } from '../context/accountContext'
import type { ConfirmationMessage } from '../types'

/**
 * _please don't forget to memo `onConfirmation`_ :)
 * @param onConfirmation the callback to call with the new confirmation
 */
const useListenToConfirmations = (
  onConfirmation: (confirmation: ConfirmationMessage) => void
) => {
  const account = useCurrentAccount()

  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    wsRef.current = new WebSocket('wss://node.somenano.com/websocket')
    return () => wsRef.current?.close()
  }, [])

  useEffect(() => {
    if (
      account !== undefined &&
      wsRef.current !== undefined &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current!.send(
        JSON.stringify({
          action: 'subscribe',
          topic: 'confirmation',
          options: {
            accounts: [account.address],
          },
        })
      )
      wsRef.current!.addEventListener('message', ({ data }) => {
        const parsed = JSON.parse(data) as ConfirmationMessage
        if (parsed.topic !== 'confirmation') return
        onConfirmation(parsed)
      })

      return () =>
        wsRef.current!.send(
          JSON.stringify({
            action: 'unsubscribe',
            topic: 'confirmation',
          })
        )
    }
  }, [account, onConfirmation])
}

export default useListenToConfirmations
