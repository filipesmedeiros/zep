import clsx from 'clsx'
import { FC } from 'react'

import range from '../lib/utils/range'

export interface Props {
  filledCount: number
  className?: string
}

const PinCircles: FC<Props> = ({ filledCount, className }) => {
  return (
    <div className={clsx('flex gap-3', className)}>
      {range(6).map(num => (
        <div
          role=""
          key={num}
          className={clsx(
            'rounded-md w-5 h-8 transition-colors border-purple-500 dark:border-purple-300 border-2 duration-150',
            filledCount > num ? 'bg-purple-500 dark:bg-purple-300' : null,
            num === 1 || num === 4 ? 'skew-x-12' : '-skew-x-12'
          )}
        />
      ))}
    </div>
  )
}

export default PinCircles
