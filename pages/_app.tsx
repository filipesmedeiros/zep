import type { AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'
import { SWRConfig } from 'swr'

import Layout from '../components/Layout'
import MemCacheProvider from '../lib/context/memCacheContextProvider'
import fetcher from '../lib/fetcher'
import useProtectedRoutes from '../lib/hooks/useProtectedRoutes'
import useSetupNotifications from '../lib/hooks/useSetupNotifications'
import useSetupServiceWorker from '../lib/hooks/useSetupServiceWorker'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useSetupServiceWorker()
  useSetupNotifications()
  const { safeToRender } = useProtectedRoutes()

  if (!safeToRender) return null // todo

  return (
    <>
      <Head>
        <title>zep⚡️ - nano wallet</title>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <MemCacheProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MemCacheProvider>
      </SWRConfig>
    </>
  )
}

export default MyApp
