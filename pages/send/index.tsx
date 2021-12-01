import { ArrowDownIcon } from '@heroicons/react/outline'
import { PaperAirplaneIcon } from '@heroicons/react/solid'
import Big from 'bignumber.js'
import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import useSendNano from '../../lib/hooks/useSendNano'

Big.config({ EXPONENTIAL_AT: 1e9 })
const bigToConvert = new Big(`1${'0'.repeat(30)}`)

const Send: NextPage = () => {
  const { query, push, replace, pathname } = useRouter()
  const { address, amount } = query as { address?: string; amount?: string }

  const [xnoToSend, setXnoToSend] = useState('')
  const onXnoAmountChange = useCallback(
    (value: string) => {
      setXnoToSend(value)
      replace({
        pathname,
        query: {
          ...query,
          amount:
            value !== ''
              ? new Big(value).times(bigToConvert).toString() // since nanocurrency-js can't handle decimals :(
              : '',
        },
      })
    },
    [replace, pathname, query]
  )
  const { send } = useSendNano()

  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const sliderPercentage = Math.min(
    (Math.max(currentX - startX, 0) * 100) / 228 / 100,
    1
  )
  const [sliding, setSliding] = useState(false)

  const backToBase = useCallback(() => {
    setStartX(0)
    setCurrentX(0)
    setSliding(false)
  }, [setStartX, setCurrentX, setSliding])

  useEffect(() => {
    if (sliderPercentage === 1) {
      const sendNano = async () => {
        try {
          await send(address as string, amount as string)
          push('/dashboard')
        } catch {
          backToBase()
        }
      }
      sendNano()
    }
  }, [sliderPercentage, push, address, amount, xnoToSend, send, backToBase])

  const hasQueryAmount = amount !== undefined && amount !== '' && amount !== '0'
  const disableSlider = !hasQueryAmount

  useEffect(() => {
    if (hasQueryAmount && xnoToSend === '')
      setXnoToSend(convert(amount, { from: Unit.raw, to: Unit.Nano }))
  }, [amount, xnoToSend, hasQueryAmount])

  return (
    <div className="flex flex-col h-full gap-8 pb-4">
      <span className="flex items-center gap-2">
        <PaperAirplaneIcon className=" dark:text-purple-50 h-7 xs:h-10 text-gray-900 rotate-[30deg] translate-x-1" />
        <h1 className="text-3xl sm:text-5xl">send</h1>
      </span>
      <form
        onSubmit={ev => ev.preventDefault()}
        className="flex flex-col gap-3 items-center h-full"
      >
        <div className="flex items-center gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-100 focus-within:bg-purple-200 py-2 px-4 w-48 overflow-hidden dark:focus-within:bg-gray-700">
          <label htmlFor="xnoToSend">Ӿ</label>
          <input
            name="xno-amount"
            id="xno-amount"
            maxLength={15}
            className="bg-transparent focus:outline-none"
            value={xnoToSend}
            pattern="[0-9]*[\.,]?[0-9]{0,6}"
            step="0.000001"
            autoComplete="off"
            onChange={({ target: { value, validity } }) => {
              if (!validity.patternMismatch) onXnoAmountChange(value)
            }}
          />
        </div>
        <span className="flex-1 text-lg text-center">
          <span className="text-extrabold">to</span>
          <br />
          <span className="text-purple-400 font-medium">
            {address?.substring(0, 10)}
          </span>
          {address?.substring(10, 21)}
          <br />
          {address?.substring(21, 42)}
          <br />
          {address?.substring(42, 56)}
          <span className="text-purple-400 font-medium">
            {address?.substring(56)}
          </span>
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
            {/* <PaperAirplaneIcon
              className="h-7 dark:text-gray-900 translate-x-0.5"
              style={{
                transform: `translateX(var(--tw-translate-x)) rotate(${
                  30 + 60 * sliderPercentage
                }deg)`,
              }}
            /> */}
            <span className="dark:text-gray-900 text-purple-50 text-3xl font-medium flex justify-center select-none">
              Ӿ
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
  )
}

export default Send
