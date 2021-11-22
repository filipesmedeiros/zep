import clsx from 'clsx'
import { Unit, convert } from 'nanocurrency'
import { FC } from 'react'
import useSWR from 'swr'

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

  const { data: account } = useSWR<{
    balance: string
    pending: string
  }>('https://mynano.ninja/api/node', {
    fetcher: input =>
      fetcher(input, {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          action: 'account_balance',
          account:
            'nano_1nndpwon4wtxk3ay67mwirdjnk3iuffznfgqkcchammtk63yqamotiqfybnp',
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
      <h2 className="text-4xl text-center">
        Ӿ {showXnoBalance && <>{Number(xnoBalance).toFixed(2)}</>}
      </h2>
      {showFiatBalance && (
        <h2 className="text-xl text-center">
          $ {(Number(xnoBalance) * xnoPrice.price).toFixed(2)}
        </h2>
      )}
    </div>
  )
}

export default Balance
