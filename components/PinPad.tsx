import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'

import { checkBiometrics } from '../lib/biometrics'
import NumPad from './NumPad'
import PinCircles from './PinCircles'

const pinLength = 6

export interface Props {}

const PinPad: FC<Props> = ({}) => {
  const [currPin, setCurrPin] = useState<number[]>([])
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [denied, setDenied] = useState(false)

  const pinCirclesWrapRef = useRef<HTMLDivElement>(null)
  pinCirclesWrapRef.current?.addEventListener('animationend', () => {
    setDenied(false)
    setCurrPin([])
  })

  useEffect(() => {
    if (wrongAttempts === 3) console.log('bad!') // todo
  }, [wrongAttempts])

  const { push } = useRouter()

  useEffect(() => {
    const pinAuth = async (pin: string) => {
      // todo
      const pinCorrect = pin === '666666'
      if (pinCorrect) {
        // todo
        push('/dashboard')
      } else {
        setWrongAttempts(prev => prev + 1)
        setDenied(true)
      }
    }

    if (currPin.length === 6) pinAuth(currPin.join(''))
  }, [currPin, push])

  const triggerBiometrics = async () => {
    await checkBiometrics(new Uint8Array())
    push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm px-16 gap-10 h-72">
      <div
        ref={pinCirclesWrapRef}
        className={clsx({ 'animate-denied': denied })}
      >
        <PinCircles filledCount={currPin.length} />
      </div>
      <NumPad
        onNumPress={num =>
          setCurrPin(prev =>
            prev.length === pinLength ? prev : [...prev, num]
          )
        }
        onDelete={() =>
          setCurrPin(prev =>
            prev.length === 0 ? prev : prev.slice(0, prev.length - 1)
          )
        }
        onFingerprintPress={triggerBiometrics}
      />
    </div>
  )
}

export default PinPad
