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
      <div className="h-full flex flex-col items-center gap-4 xs:gap-7">
        <header className="flex items-center w-full gap-2">
          <LoginIcon className="-rotate-child-90 dark:text-purple-50 h-7 xs:h-10 text-gray-900 translate-x-1 transition-colors" />
          <h1 className="text-3xl sm:text-5xl">receive</h1>
        </header>

        <canvas
          className="rounded shadow !w-40 !h-40 xs:!w-64 xs:!h-64 sm:!w-80 sm:!h-80"
          ref={canvasRef}
        />

        <div className="flex flex-col items-center gap-1 xs:gap-3">
          <span className="text-xl transition-colors">optional amount</span>
          <XnoInput value={xnoToSend} onChange={setXnoToSend} />
        </div>
      </div>
    </>
  )
}

export default MyQrCode
