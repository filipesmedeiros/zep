import qr from 'qrcode'
import { RefObject, useEffect } from 'react'
import colors from 'tailwindcss/colors'

import genTxnUrl from '../getTxnUrl'

const useDrawQrCode = (
  canvasRef: RefObject<HTMLCanvasElement>,
  { raw, address }: { raw?: string; address: string }
) => {
  useEffect(() => {
    if (canvasRef.current === null) return
    qr.toCanvas(canvasRef.current, genTxnUrl({ address: address, raw }), {
      color: { light: colors.violet['500'], dark: colors.white },
    })
  }, [raw, address, canvasRef])
}

export default useDrawQrCode
