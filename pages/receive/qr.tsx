import { LoginIcon } from '@heroicons/react/outline'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import XnoInput from '../../components/XnoInput'
import { useAccount } from '../../lib/context/accountContext'
import useDrawQrCode from '../../lib/hooks/useDrawQrCode'

const MyQrCode: NextPage = () => {
  const account = useAccount()
  const { query } = useRouter()
  const { amount } = query as { amount?: string }
  const canvasRef = useDrawQrCode({
    address: account?.address ?? '',
    raw: amount,
  })

  const [xnoToSend, setXnoToSend] = useState('')

  return (
    <>
      <Head>
        <title>zep⚡️ - my qrcode</title>
      </Head>
      <div className="h-full flex flex-col gap-8">
        <span className="flex items-center justify-start gap-2">
          <LoginIcon className="-rotate-child-90 dark:text-purple-50 h-7 xs:h-10 text-gray-900 translate-x-1 transition-colors" />
          <h1 className="text-3xl sm:text-5xl">receive</h1>
        </span>

        <canvas className="rounded place-self-center shadow" ref={canvasRef} />

        <div className="flex flex-col place-self-center items-center gap-3">
          <span className="text-xl transition-colors">optional amount</span>
          <XnoInput value={xnoToSend} onChange={setXnoToSend} />
        </div>
      </div>
    </>
  )
}

export default MyQrCode
