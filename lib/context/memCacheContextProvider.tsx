import type { FC } from 'react'

import useSetupChallenge from '../hooks/useSetupChallenge'
import { AccountProvider } from './accountContext'
import { PreferencesProvider } from './preferencesContext'

const MemCacheProvider: FC = ({ children }) => {
  useSetupChallenge()

  return (
    <AccountProvider>
      <PreferencesProvider>{children}</PreferencesProvider>
    </AccountProvider>
  )
}

export default MemCacheProvider
