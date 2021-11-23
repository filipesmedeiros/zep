import type { NextPage } from 'next'
import { useRef } from 'react'

import useDrawQrCode from '../lib/hooks/useDrawQrCode'

const MyQrCode: NextPage = () => {
  const canvasRef = useRef(null)
  useDrawQrCode(canvasRef, {
    address:
      'nano_1nndpwon4wtxk3ay67mwirdjnk3iuffznfgqkcchammtk63yqamotiqfybnp',
  })

  return (
    <div className="grid gap-4 place-content-center h-full w-full">
      <h1 className="text-3xl font-semibold text-center">get scanned!</h1>
      <canvas className="!w-80 !h-80" ref={canvasRef} />
    </div>
  )
}

export default MyQrCode
