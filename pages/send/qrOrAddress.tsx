import { PaperAirplaneIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'

import AddressInput from '../../components/AddressInput'
import useReadQrFromVideo from '../../lib/hooks/useReadQrFromVideo'
import isTxnUrl from '../../lib/xno/isTxnUrl'
import isXnoAddress from '../../lib/xno/isXnoAddress'
import txnUrlToParts from '../../lib/xno/txnUrlToParts'
import xnoUrlHasAmount from '../../lib/xno/xnoUrlHasAmount'

const ReadQrCode: NextPage = () => {
  const { push } = useRouter()
  const onQrCodeRead = useCallback(
    (urlOrAddress: string) => {
      if (isTxnUrl(urlOrAddress)) {
        const { address, amount } = txnUrlToParts(urlOrAddress)
        push({
          pathname: '/send',
          query: {
            address,
            ...(xnoUrlHasAmount(urlOrAddress) ? { amount } : {}),
          },
        })
      } else push({ pathname: '/send', query: { address: urlOrAddress } })
    },
    [push]
  )
  const { videoLive, videoRef } = useReadQrFromVideo(onQrCodeRead)

  const [address, setAddress] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (address !== '' && formRef.current !== null && isXnoAddress(address))
      formRef.current.requestSubmit()
  }, [address, formRef])

  return (
    <>
      <Head>
        <title>zep⚡️ - read qrcode</title>
      </Head>
      <div className="flex flex-col h-full min-h-0 gap-8 pb-4">
        <span className="flex items-center gap-2">
          <PaperAirplaneIcon className=" dark:text-purple-50 h-7 xs:h-10 text-gray-900 rotate-[30deg] transition-colors translate-x-1" />
          <h1 className="text-3xl sm:text-5xl">send</h1>
        </span>
        <video
          className={clsx('rounded flex-1 shadow-md min-h-0', {
            hidden: !videoLive,
          })}
          ref={videoRef}
        />
        {!videoLive && (
          <div className="w-full flex-1 h-64 rounded dark:bg-gray-800 bg-purple-50 animate-pulse"></div>
        )}
        <div className="flex flex-col justify-self-end items-center gap-2 text-gray-900 dark:text-purple-50">
          <span className="text-2xl">or</span>
          <form
            ref={formRef}
            onSubmit={e => {
              e.preventDefault()
              if (address !== '')
                push({ pathname: '/send', query: { address } })
            }}
          >
            <AddressInput value={address} onChange={setAddress} />
          </form>
        </div>
      </div>
    </>
  )
}

export default ReadQrCode
