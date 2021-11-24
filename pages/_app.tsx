import type { AppProps } from 'next/app'
import { FC } from 'react'
import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import { AddressProvider } from '../lib/context/addressContext'
import { PreferencesProvider } from '../lib/context/preferencesContext'
import fetcher from '../lib/fetcher'
import useDarkMode from '../lib/hooks/useDarkMode'
import useProtectedRoutes from '../lib/hooks/useProtectedRoutes'
import useSetupChallenge from '../lib/hooks/useSetupChallenge'
import useSetupSw from '../lib/hooks/useSetupSw'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useSetupChallenge()
  useSetupSw()
  useDarkMode()

  const validatingCredential = useProtectedRoutes()

  if (validatingCredential) return null // todo

  return (
    <SWRConfig value={{ fetcher, provider: () => new Map() }}>
      <AddressProvider>
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
