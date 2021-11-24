import qr from 'qrcode'
import { RefObject, useEffect, useRef } from 'react'
import colors from 'tailwindcss/colors'

import { usePreferences } from '../context/preferencesContext'
import genTxnUrl from '../nano/getTxnUrl'
import { prefersDarkMode } from '../preferences/darkMode'

const useDrawQrCode = ({ raw, address }: { raw?: string; address: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    preferences: { darkMode },
  } = usePreferences()
  useEffect(() => {
    if (canvasRef.current === null) return

    qr.toCanvas(canvasRef.current, genTxnUrl({ address: address, raw }), {
      color: {
        light: darkMode ? colors.coolGray['900'] : colors.white,
        dark: colors.violet['500'],
      },
    })
  }, [raw, address, canvasRef, darkMode])

  return canvasRef
}

export default useDrawQrCode
