import { UploadIcon } from '@heroicons/react/solid'
import { Unit, convert } from 'nanocurrency'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

import useSendNano from '../../lib/hooks/useSendNano'

const Send: NextPage = () => {
  const { query } = useRouter()
  const { address, amount } = query

  const hasAmount = amount !== undefined

  const [xnoToSend, setXnoToSend] = useState('')
  const { send } = useSendNano()

  return (
    <div>
      {hasAmount ? (
        <>
          <h1>you&apos;re sending</h1>
          <h2>
            Ӿ {convert(amount as string, { from: Unit.raw, to: Unit.Nano })}
          </h2>
          <span>to</span>
          <h2>{address}</h2>
        </>
      ) : (
        <>
          <h1>send</h1>
          <h2>Ӿ</h2>
          <input
            className="text-gray-900"
            value={xnoToSend}
            onChange={({ target: { value } }) => setXnoToSend(value)}
          />
          <span>to</span>
          <h2>{address}</h2>
        </>
      )}
      <button
        onClick={() =>
          send(
            address as string,
            (amount as string) ??
              convert(xnoToSend, { from: Unit.Nano, to: Unit.raw })
          )
        }
      >
        send <UploadIcon />
      </button>
    </div>
  )
}

export default Send
