import { BackspaceIcon, FingerPrintIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import range from '../lib/utils/range'

export interface Props {
  onNumPress: (num: number) => void
  onDelete: () => void
  onFingerprintPress: () => void
}

const NumPad: FC<Props> = ({ onNumPress, onDelete, onFingerprintPress }) => {
  const [activeKey, setActiveKey] = useState<number | undefined>(undefined)
  const {
    preferences: { biometricsAuth },
  } = usePreferences()

  const timeoutRef = useRef<number>()
  useEffect(() => {
    const onKeyPress = ({ key }: KeyboardEvent) => {
      const num = Number(key)
      if (!isNaN(num)) {
        onNumPress(num)
        setActiveKey(num)
        timeoutRef.current = window.setTimeout(
          () => setActiveKey(undefined),
          100
        )
      }
    }
    const onKeyUp = ({ key }: KeyboardEvent) => {
      if (key === 'Backspace') {
        onDelete()
        setActiveKey(-1)
        timeoutRef.current = window.setTimeout(
          () => setActiveKey(undefined),
          100
        )
      }
    }
    window.addEventListener('keypress', onKeyPress)
    window.addEventListener('keyup', onKeyUp)

    const clearSideEffects = () => {
      window.removeEventListener('keypress', onKeyPress)
      window.removeEventListener('keyup', onKeyUp)
      clearTimeout(timeoutRef.current)
    }
    return clearSideEffects
  }, [onNumPress, onDelete])

  return (
    <div
      className={clsx(
        'grid grid-rows-4 grid-cols-3 gap-2 justify-between w-full h-full text-2xl'
      )}
    >
      {range(9).map(num => (
        <button
          className={clsx(
            'hover:bg-purple-50 hover:text-purple-600 active:bg-purple-100 transition-colors duration-100 rounded',
            activeKey === num + 1 ? 'bg-purple-100' : null
          )}
          key={num}
          onClick={() => onNumPress(num + 1)}
        >
          {num + 1}
        </button>
      ))}
      {!biometricsAuth && (
        <button
          onClick={onFingerprintPress}
          className={clsx(
            'flex justify-center items-center hover:bg-purple-50 hover:text-purple-600 active:bg-purple-100 transition-colors duration-100 rounded'
          )}
        >
          <FingerPrintIcon className="w-7" />
        </button>
      )}
      <button
        className={clsx(
          'hover:bg-purple-50 hover:text-purple-600 active:bg-purple-100 transition-colors duration-100 rounded',
          activeKey === 0 ? 'bg-purple-100' : null,
          biometricsAuth ? 'col-start-2' : null
        )}
        onClick={() => onNumPress(0)}
      >
        0
      </button>
      <button
        onClick={onDelete}
        className={clsx(
          'flex justify-center items-center hover:bg-purple-50 hover:text-purple-600 active:bg-purple-100 transition-colors rounded',
          activeKey === -1 ? 'bg-purple-100' : null
        )}
      >
        <BackspaceIcon className="w-7" />
      </button>
    </div>
  )
}

export default NumPad
