import { LoginIcon } from '@heroicons/react/outline'
import type { NextPage } from 'next'

import { useAccount } from '../../lib/context/accountContext'
import useDrawQrCode from '../../lib/hooks/useDrawQrCode'

const MyQrCode: NextPage = () => {
  const account = useAccount()
  const canvasRef = useDrawQrCode({ address: account?.address ?? '' })

  return (
    <div className="h-full flex flex-col gap-8">
      <span className="flex items-center justify-start gap-2">
        <LoginIcon className="-rotate-child-90 dark:text-purple-50 h-7 xs:h-10 text-gray-900 translate-x-1" />
        <h1 className="text-3xl sm:text-5xl">receive</h1>
      </span>

      <canvas
        className="!w-64 !h-64 rounded place-self-center shadow-lg"
        ref={canvasRef}
      />
    </div>
  )
}

export default MyQrCode
