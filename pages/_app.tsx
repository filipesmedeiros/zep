import type { AppProps } from 'next/app'
import { FC } from 'react'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import { PreferencesProvider } from '../lib/context/preferencesContext'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <PreferencesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PreferencesProvider>
  )
}

export default MyApp
