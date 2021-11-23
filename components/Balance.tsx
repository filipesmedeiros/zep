import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import { FC } from 'react'
import useSWR from 'swr'

import { useAddress } from '../lib/context/addressContext'
import { usePreferences } from '../lib/context/preferencesContext'
import fetcher from '../lib/fetcher'
import { ShowCurrency } from '../lib/preferences/showCurrencyDash'

export interface Props {
  className?: string
}

const Balance: FC<Props> = ({ className }) => {
  const { data: xnoPrice } = useSWR<{
    price: number
  }>('https://nano.to/price?json=true', {
    fetcher,
  })

  const { address } = useAddress()

  const { data: account } = useSWR<{
    balance: string
    pending: string
  }>(address !== undefined ? 'https://mynano.ninja/api/node' : null, {
    fetcher: input =>
      fetcher(input, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          action: 'account_balance',
          account: address,
        }),
      }),
  })

  const {
    preferences: { showCurrencyDash },
    togglePreference,
  } = usePreferences()

  const showXnoBalance =
    showCurrencyDash !== ShowCurrency.None && account !== undefined

  const showFiatBalance =
    showCurrencyDash === ShowCurrency.Both &&
    xnoPrice !== undefined &&
    account !== undefined

  const xnoBalance = convert(account?.balance ?? '0', {
    from: Unit.raw,
    to: Unit.NANO,
  })

  return (
    <div
      className={clsx(
        'bg-purple-500 text-white py-4 px-7 rounded-lg shadow-lg',
        className
      )}
      onClick={() => togglePreference('showCurrencyDash')}
    >
      <h3 className="text-4xl text-center">
        {showXnoBalance ? (
          <>Ӿ {Number(xnoBalance).toFixed(2)}</>
        ) : (
          <>
            Ӿ<span className="font-semibold">NO</span>
          </>
        )}
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
