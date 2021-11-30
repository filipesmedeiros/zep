import clsx from 'clsx'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import useReadQrFromVideo from '../../lib/hooks/useReadQrFromVideo'
import isTxnUrl from '../../lib/xno/isTxnUrl'
import txnUrlToParts from '../../lib/xno/txnUrlToParts'

const ReadQrCode: NextPage = () => {
  const { push } = useRouter()
  const onQrCodeRead = useCallback(
    (urlOrAddress: string) => {
      if (isTxnUrl(urlOrAddress)) {
        const { address, amount } = txnUrlToParts(urlOrAddress)
        push(`/send?address=${address}&amount=${amount}`)
      } else push(`/send?address=${urlOrAddress}`)
    },
    [push]
  )
  const { videoLive, videoRef } = useReadQrFromVideo(onQrCodeRead)

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <h1 className="text-3xl font-semibold text-center text-purple-50">
        scan!
      </h1>
      <video
        className={clsx('rounded shadow-md', { hidden: !videoLive })}
        ref={videoRef}
      />
      {!videoLive && (
        <div className="w-full h-64 bg-purple-400 rounded animate-pulse"></div>
      )}
    </div>
  )
}

export default ReadQrCode
