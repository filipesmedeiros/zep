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
    <div className={clsx('dark:text-purple-50 text-gray-900 flex', className)}>
      <div
        onClick={() =>
          setPreference('showCurrencyDash', nextShowCurrency(showCurrencyDash))
        }
        className="hover:cursor-pointer"
      >
        <h3 className="text-4xl">
          <span className="transition-colors">Ӿ</span>
          <span
            className={clsx(
              'transition-colors',
              showXnoBalance ? 'font-medium' : 'font-semibold'
            )}
          >
            {showXnoBalance ? (
              account?.balance === null ? (
                '0.00'
              ) : (
                <>
                  {' '}
                  {xnoBalanceDisplay.substring(0, 8)}
                  <span className="text-base">
                    {xnoBalanceDisplay.substring(8)}
                  </span>
                </>
              )
            ) : (
              'NO'
            )}
          </span>
        </h3>
        {showFiatBalance && (
          <h4 className="text-xl transition-colors">
            $ {(Number(xnoBalance) * xnoPrice).toFixed(2)}
          </h4>
        )}
      </div>
    </div>
  )
}

export default Balance
