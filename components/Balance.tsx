import clsx from 'clsx'
import { tools } from 'nanocurrency-web'
import { FC, useMemo } from 'react'
import useSWR from 'swr'

import { useAddress } from '../lib/context/addressContext'
import { usePreferences } from '../lib/context/preferencesContext'
import { ShowCurrencyPreference } from '../lib/db/preferences'
import fetcher from '../lib/fetcher'

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
  const { data: xnoPrice } = useSWR<{
    price: number
  }>('https://nano.to/price?json=true', {
    fetcher,
  })

  const { address } = useAddress()

  const params = useMemo(
    () => ({
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify({
        action: 'account_balance',
        account: address,
      }),
    }),
    [address]
  )

  const { data: account } = useSWR<{
    balance: string
    pending: string
  }>(address !== undefined ? ['https://mynano.ninja/api/node', params] : null)

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

  return (
    <div
      className={clsx(
        'bg-purple-500 dark:text-gray-900 text-purple-100 py-4 px-7 rounded shadow-lg',
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
          {showXnoBalance ? <> {Number(xnoBalance).toFixed(2)}</> : 'NO'}
        </span>
      </h3>
      {showFiatBalance && (
        <h3 className="text-xl text-center">
          $ {(Number(xnoBalance) * xnoPrice.price).toFixed(2)}
        </h3>
      )}
    </div>
  )
}

export default Balance
