import clsx from 'clsx'
import type { NextPage } from 'next'

import useReadQrFromVideo from '../lib/hooks/useReadQrFromVideo'

const ReadQrCode: NextPage = () => {
  const { videoLive, videoRef } = useReadQrFromVideo()

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <h1 className="text-3xl font-semibold text-center text-white">scan!</h1>
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
