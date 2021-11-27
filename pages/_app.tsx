import type { AppProps } from 'next/app'
import { FC } from 'react'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import MemCacheProvider from '../lib/context/memCacheContextProvider'
import useProtectedRoutes from '../lib/hooks/useProtectedRoutes'
import useSetupDb from '../lib/hooks/useSetupDb'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const ready = useSetupDb(10)
  const validatingCredential = useProtectedRoutes(!ready)

  if (validatingCredential) return null // todo

  return (
    <MemCacheProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MemCacheProvider>
  )
}

export default MyApp
