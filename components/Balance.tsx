import clsx from 'clsx'
import { tools } from 'nanocurrency-web'
import { FC } from 'react'

import { useCurrentAccount } from '../lib/context/accountContext'
import { usePreferences } from '../lib/context/preferencesContext'
import { ShowCurrencyPreference } from '../lib/db/types'
import useXnoPrice from '../lib/hooks/useXnoPrice'
import rawToNanoDisplay from '../lib/xno/rawToNanoDisplay'

export interface Props {
  className?: string
}

const nextShowCurrency = (curr: ShowCurrencyPreference | undefined) =>
  curr === ShowCurrencyPreference.Both
    ? ShowCurrencyPreference.Xno
    : curr === ShowCurrencyPreference.Xno
    ? ShowCurrencyPreference.None
    : ShowCurrencyPreference.Both

const Balance: FC<Props> = ({ className }) => {
  const { xnoPrice } = useXnoPrice()

  const account = useCurrentAccount()

  const {
    preferences: { showCurrencyDash },
    setPreference,
  } = usePreferences()

  const showXnoBalance =
    showCurrencyDash !== ShowCurrencyPreference.None && account !== undefined

  const showFiatBalance =
    showCurrencyDash === ShowCurrencyPreference.Both &&
    xnoPrice !== undefined &&
    account !== undefined

  const xnoBalance = tools.convert(account?.balance ?? '0', 'RAW', 'NANO')
  const xnoBalanceDisplay = rawToNanoDisplay(account?.balance ?? '0')

  return (
    <div
      className={clsx(
        'bg-purple-500 dark:text-gray-900 text-purple-50 py-4 px-7 rounded shadow-lg',
        className
      )}
      onClick={() =>
        setPreference('showCurrencyDash', nextShowCurrency(showCurrencyDash))
      }
    >
      <h3 className="text-4xl text-center">
        Ӿ
        <span
          className={clsx(
            showXnoBalance ? 'font-medium dark:font-semibold' : 'font-semibold'
          )}
        >
          {showXnoBalance ? (
            <> {xnoBalanceDisplay === 'small' ? '<0.01' : xnoBalanceDisplay}</>
          ) : (
            'NO'
          )}
        </span>
      </h3>
      {showFiatBalance && (
        <h3 className="text-xl text-center">
          $ {(Number(xnoBalance) * xnoPrice).toFixed(2)}
        </h3>
      )}
    </div>
  )
}

export default Balance
