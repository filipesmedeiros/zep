import { PaperAirplaneIcon } from '@heroicons/react/solid'
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
    <div className="flex flex-col h-full gap-8">
      <span className="flex items-center gap-2">
        <PaperAirplaneIcon className=" dark:text-purple-50 h-7 xs:h-10 text-gray-900 rotate-[30deg] translate-x-1" />
        <h1 className="text-3xl sm:text-5xl">send</h1>
      </span>
      <video
        className={clsx('rounded shadow-md', { hidden: !videoLive })}
        ref={videoRef}
      />
      {!videoLive && (
        <div className="w-full h-64 rounded dark:bg-gray-800 animate-pulse"></div>
      )}
    </div>
  )
}

export default ReadQrCode
