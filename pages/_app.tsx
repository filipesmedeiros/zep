import type { AppProps } from 'next/app'
import { FC } from 'react'
import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import { AddressProvider } from '../lib/context/addressContext'
import { PreferencesProvider } from '../lib/context/preferencesContext'
import fetcher from '../lib/fetcher'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SWRConfig value={{ fetcher, provider: () => new Map() }}>
      <AddressProvider address="nano_1nndpwon4wtxk3ay67mwirdjnk3iuffznfgqkcchammtk63yqamotiqfybnp">
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
