import qr from 'qrcode'
import { useEffect, useRef } from 'react'
import colors from 'tailwindcss/colors'

import { usePreferences } from '../context/preferencesContext'
import genTxnUrl from '../xno/getTxnUrl'

const useDrawQrCode = ({ raw, address }: { raw?: string; address: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    preferences: { darkMode },
  } = usePreferences()
  useEffect(() => {
    if (canvasRef.current === null) return

    qr.toCanvas(canvasRef.current, genTxnUrl({ address: address, raw }), {
      color: {
        light: darkMode ? colors.coolGray['800'] : colors.white,
        dark: colors.violet['50'],
      },
    })
  }, [raw, address, canvasRef, darkMode])

  return canvasRef
}

export default useDrawQrCode
