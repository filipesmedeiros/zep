import type { NextPage } from 'next'
import { useRef } from 'react'

import useDrawQrCode from '../lib/hooks/useDrawQrCode'

const MyQrCode: NextPage = () => {
  const canvasRef = useDrawQrCode({
    address:
      'nano_1nndpwon4wtxk3ay67mwirdjnk3iuffznfgqkcchammtk63yqamotiqfybnp',
  })

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
