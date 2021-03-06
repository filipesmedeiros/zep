import { PaperAirplaneIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import XnoInput from '../../components/XnoInput'
import { getContact } from '../../lib/db/contacts'
import fetcher from '../../lib/fetcher'
import useChallenge from '../../lib/hooks/useChallenge'
import useCredentialId from '../../lib/hooks/useCredentialId'
import useSendNano from '../../lib/hooks/useSendNano'
import showNotification from '../../lib/showNotification'
import { NanoToUsernameResponse } from '../../lib/types'
import isXnoAddress from '../../lib/xno/isXnoAddress'

const Send: NextPage = () => {
  const { query, push } = useRouter()
  const { to, amount } = query as { to: string; amount?: string }

  const [xnoToSend, setXnoToSend] = useState('')

  const { send } = useSendNano()

  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const sliderPercentage = Math.min(
    (Math.max(currentX - startX, 0) * 100) / 228 / 100,
    1
  )
  const [sliding, setSliding] = useState(false)

  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const backToBase = useCallback(() => {
    setStartX(0)
    setCurrentX(0)
    setSliding(false)
  }, [setStartX, setCurrentX, setSliding])

  const [toAddress, setToAddress] = useState<string>()
  useEffect(() => {
    const parseName = async (name: string) => {
      const contact = await getContact(name)
      if (contact !== undefined) return contact.address
      else
        return fetcher<NanoToUsernameResponse>(
          `https://nano.to/${to}/username?json=true`
        ).then(res => res.address)
    }

    isXnoAddress(to) ? setToAddress(to) : parseName(to!).then(setToAddress)
  }, [to])

  useEffect(() => {
    if (sliderPercentage === 1) {
      const sendNano = async () => {
        backToBase()
        await send(toAddress!, amount!)
        showNotification({
          title: 'sent!',
          body: `sent ??${convert(amount!, {
            from: Unit.raw,
            to: Unit.Nano,
          })} to ${to}`,
          tag: 'send',
        })
        push('/dashboard')
      }
      sendNano()
    }
  }, [
    sliderPercentage,
    push,
    to,
    amount,
    xnoToSend,
    toAddress,
    send,
    backToBase,
    challenge,
    credentialId,
  ])

  const hasQueryAmount = amount !== undefined && amount !== '' && amount !== '0'
  const disableSlider = !hasQueryAmount

  useEffect(() => {
    if (hasQueryAmount && xnoToSend === '')
      setXnoToSend(convert(amount, { from: Unit.raw, to: Unit.Nano }))
  }, [amount, xnoToSend, hasQueryAmount])

  return (
    <>
      <Head>
        <title>zep?????? - send ??NO</title>
      </Head>
      <div className="flex flex-col h-full gap-8 pb-4">
        <span className="flex items-center gap-2">
          <PaperAirplaneIcon className="transition-colors dark:text-purple-50 h-7 xs:h-10 text-gray-900 rotate-[30deg] translate-x-1" />
          <h1 className="text-3xl sm:text-5xl font-medium">send</h1>
        </span>
        <form
          onSubmit={ev => ev.preventDefault()}
          className="flex flex-col gap-3 items-center h-full"
        >
          <XnoInput value={xnoToSend} onChange={setXnoToSend} />
          <span className="flex-1 text-lg text-center">
            <span className="font-extrabold">to</span>
            {!isXnoAddress(to) && (
              <>
                <br />
                <span className="text-2xl font-bold">{to}</span>
              </>
            )}
            <br />
            {!isXnoAddress(to) && <>(</>}
            <span className="text-purple-400 font-medium">
              {toAddress?.substring(0, 10)}
            </span>
            {toAddress?.substring(10, 21)}
            <br />
            {toAddress?.substring(21, 42)}
            <br />
            {toAddress?.substring(42, 56)}
            <span className="text-purple-400 font-medium">
              {toAddress?.substring(56)}
            </span>
            {!isXnoAddress(to) && <>)</>}
          </span>
          <div
            className={clsx(
              'dark:bg-gray-800 bg-purple-100 rounded-2xl p-2 relative w-72 z-10 transition-all hover:cursor-pointer',
              {
                'opacity-50': disableSlider,
              }
            )}
            onMouseMove={ev => {
              if (sliding && !disableSlider) setCurrentX(ev.clientX)
            }}
            onMouseUp={() => {
              if (sliderPercentage !== 1 && !disableSlider) backToBase()
            }}
            onMouseLeave={() => {
              if (sliderPercentage !== 1 && !disableSlider) backToBase()
            }}
          >
            <div
              className={clsx(
                'dark:bg-purple-50 bg-purple-400 p-2 rounded-xl w-11 z-30 transform-gpu transition-colors',
                {
                  'transition-all': !sliding,
                }
              )}
              style={{
                transform: `translate3d(${sliderPercentage * 228}px, 0, 0)`,
              }}
              onTouchStart={ev => {
                if (!disableSlider) {
                  setSliding(true)
                  setStartX(ev.touches.item(0).clientX)
                }
              }}
              onTouchMove={ev => {
                if (sliding && !disableSlider)
                  setCurrentX(ev.touches.item(0).clientX)
              }}
              onTouchEnd={() => {
                if (!disableSlider) backToBase()
              }}
              onMouseDown={ev => {
                if (!disableSlider) {
                  setSliding(true)
                  setStartX(ev.clientX)
                }
              }}
            >
              <span
                className="dark:text-gray-900 text-purple-50 text-3xl font-medium flex justify-center select-none"
                style={{
                  transform: `scale3d(${1 + 0.4 * sliderPercentage}, ${
                    1 + 0.4 * sliderPercentage
                  }, 1)`,
                }}
              >
                ??
              </span>
            </div>
            <span
              className="absolute dark:text-purple-50 text-purple-400 text-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none transition-colors"
              style={{ opacity: 0.7 - 0.7 * sliderPercentage, zIndex: -10 }}
            >
              slide to send
            </span>
          </div>
        </form>
      </div>
    </>
  )
}

export default Send
