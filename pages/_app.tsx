import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import { AddressProvider } from '../lib/context/accountContext'
import { PreferencesProvider } from '../lib/context/preferencesContext'
import fetcher from '../lib/fetcher'
import useDarkMode from '../lib/hooks/useDarkMode'
import useProtectedRoutes from '../lib/hooks/useProtectedRoutes'
import useSetupAccounts from '../lib/hooks/useSetupAccounts'
import useSetupChallenge from '../lib/hooks/useSetupChallenge'
import useSetupSw from '../lib/hooks/useSetupSw'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useSetupChallenge()
  useSetupSw()
  useDarkMode()

  const { accounts } = useSetupAccounts()

  const validatingCredential = useProtectedRoutes()

  if (validatingCredential) return null // todo

  return (
    <SWRConfig value={{ fetcher, provider: () => new Map() }}>
      <AddressProvider initialAccounts={accounts} initialAccountIndex={0}>
        <PreferencesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PreferencesProvider>
      </AddressProvider>
    </SWRConfig>
  )
}

export default MyApp
