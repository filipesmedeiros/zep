import { LightningBoltIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

import { useAddress } from '../lib/context/addressContext'
import { usePreferences } from '../lib/context/preferencesContext'
import { getAddress } from '../lib/db/addresses'
import useDarkMode from '../lib/hooks/useDarkMode'
import useMounted from '../lib/hooks/useMounted'
import {
  prefersDarkMode,
  togglePrefersDarkMode,
} from '../lib/preferences/darkMode'
import Balance from './Balance'
import BottomMenu from './BottomMenu'
import PreferencesMenu from './PreferencesMenu'

export interface Props {}

const Layout: FC<Props> = ({ children }) => {
  useDarkMode()
  const mounted = useMounted()
  const { pathname } = useRouter()
  const {
    preferences: { leftHanded },
    setPreference,
  } = usePreferences()
  const { setAddress } = useAddress()

  useEffect(() => {
    const listenToColorMedia = (ev: MediaQueryListEvent) => {
      setPreference('darkMode', ev.matches)
      togglePrefersDarkMode()
    }
    const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')
    setPreference('darkMode', colorMedia.matches)
    if (!prefersDarkMode()) togglePrefersDarkMode()
    colorMedia.addEventListener('change', listenToColorMedia)
  }, [setPreference])

  useEffect(() => {
    const setupAddress = async () => {
      const address = (await getAddress(0))?.address
      if (address !== undefined) setAddress(address)
    }
    setupAddress()
  }, [setAddress])

  if (!mounted) return null

  return (
    <div
      className="dark:text-white bg-purple-100 dark:bg-gray-900 relative w-screen h-screen pt-4 pb-4 px-5 grid justify-center gap-4"
      style={{
        gridTemplate:
          '"top-menu" auto "balance" auto "main" 1fr "transaction-menu" auto / 1fr',
      }}
    >
      <header
        className={clsx(
          'flex justify-between items-center',

          leftHanded ? 'flex-row-reverse' : null
        )}
        style={{ gridArea: 'top-menu' }}
      >
        <div className="flex items-start translate-x-2">
          <h1 className="font-extrabold text-2xl text-gray-900 dark:text-purple-100">
            zep
          </h1>
          <LightningBoltIcon className="text-gray-900 dark:text-purple-100 h-4" />
        </div>
        <PreferencesMenu />
      </header>
      {pathname !== '/' ? (
        <>
          <div
            className="flex place-self-center"
            style={{ gridArea: 'balance' }}
          >
            <Balance />
          </div>
          <main
            className="overflow-auto bg-purple-500 rounded-md border-t-8 border-b-8 border-purple-500 shadow-md py-6 px-3"
            style={{ gridArea: 'main' }}
          >
            {children}
          </main>
          <div style={{ gridArea: 'transaction-menu' }}>{<BottomMenu />}</div>
        </>
      ) : (
        <main className="pt-32">{children}</main>
      )}
    </div>
  )
}

export default Layout
