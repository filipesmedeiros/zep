import clsx from 'clsx'
import type { NextPage } from 'next'

import Balance from '../components/Balance'
import RecentTransactions from '../components/RecentTransactions'
import { usePreferences } from '../lib/context/preferencesContext'
import useMounted from '../lib/hooks/useMounted'
import { ShowCurrency } from '../lib/preferences/showCurrencyDash'

const Dashboard: NextPage = () => {
  const mounted = useMounted()
  const {
    preferences: { showCurrencyDash },
  } = usePreferences()
  return (
    <div
      className={clsx(
        'w-full flex flex-col items-center gap-6 transition-opacity relative',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
    >
      <Balance
        className={clsx(
          showCurrencyDash !== ShowCurrency.None ? 'fixed z-0 mt-1' : null
        )}
      />
      <RecentTransactions
        className={clsx(
          showCurrencyDash !== ShowCurrency.None ? 'mt-32' : null
        )}
      />
    </div>
  )
}

export default Dashboard
