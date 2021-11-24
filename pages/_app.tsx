import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

import Layout from '../components/Layout'
import { AddressProvider } from '../lib/context/addressContext'
import { PreferencesProvider } from '../lib/context/preferencesContext'
import { addChallenge, hasChallenge } from '../lib/db/challenges'
import fetcher from '../lib/fetcher'
import '../styles/global.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('/sw.js')
      } catch {}
    } else {
      console.log('no service worker')
    }

    const setupOsChallenge = async () => {
      const randomBytes = new Uint8Array(32)
      crypto.getRandomValues(randomBytes)
      if (!(await hasChallenge('osChallenge')))
        addChallenge('osChallenge', randomBytes)
    }

    setupOsChallenge()
  }, [])

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
