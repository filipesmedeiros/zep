import type { NextPage } from 'next'

import { useAddress } from '../lib/context/addressContext'
import useDrawQrCode from '../lib/hooks/useDrawQrCode'

const MyQrCode: NextPage = () => {
  const { address } = useAddress()
  const canvasRef = useDrawQrCode({ address: address ?? '' })

  return (
    <div className="grid gap-6 place-content-center h-full w-full">
      <h1 className="text-3xl font-extrabold text-center text-purple-100 dark:text-gray-900">
        get scanned!
      </h1>

      <canvas className="!w-64 !h-64 rounded-lg shadow-lg" ref={canvasRef} />
    </div>
  )
}

export default MyQrCode
