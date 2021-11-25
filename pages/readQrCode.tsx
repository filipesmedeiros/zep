import clsx from 'clsx'
import type { NextPage } from 'next'
import { useCallback } from 'react'

import useReadQrFromVideo from '../lib/hooks/useReadQrFromVideo'

const ReadQrCode: NextPage = () => {
  const onQrCodeRead = useCallback((url: string) => {
    console.log(url)
  }, [])
  const { videoLive, videoRef } = useReadQrFromVideo(onQrCodeRead)

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <h1 className="text-3xl font-semibold text-center text-purple-50">
        scan!
      </h1>
      <video
        className={clsx('rounded shadow-md', { hidden: !videoLive })}
        ref={videoRef}
      />
      {!videoLive && (
        <div className="w-full h-64 rounded bg-purple-400 animate-pulse"></div>
      )}
    </div>
  )
}

export default ReadQrCode
