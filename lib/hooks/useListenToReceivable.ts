import { useEffect, useRef } from 'react'

import { useCurrentAccount } from '../context/accountContext'
import type { ConfirmationMessage } from '../types'
import { defaultUrls } from '../xno/constants'

/**
 * _please don't forget to memo `onConfirmation`_ :)
 * @param onConfirmation the callback to call with the new confirmation
 */
const useListenToReceivable = (
  onConfirmation: (confirmation: ConfirmationMessage) => void
) => {
  const account = useCurrentAccount()

  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    if (account === undefined) return
    wsRef.current = new WebSocket(defaultUrls.ws)
    wsRef.current.addEventListener('open', () => {
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
        if (
          parsed.topic !== 'confirmation' ||
          parsed.message.block.subtype !== 'send' ||
          parsed.message.account === account.address
        )
          return
        onConfirmation(parsed)
      })
    })
    return () => {
      if (
        wsRef.current?.readyState !== WebSocket.CLOSING &&
        wsRef.current?.readyState !== WebSocket.CLOSED
      )
        wsRef.current?.close()
    }
  }, [account, onConfirmation])

  useEffect(() => {
    return () => {
      if (
        wsRef.current !== undefined &&
        wsRef.current.readyState === WebSocket.OPEN
      )
        wsRef.current!.send(
          JSON.stringify({
            action: 'unsubscribe',
            topic: 'confirmation',
          })
        )
    }
  }, [])
}

export default useListenToReceivable
