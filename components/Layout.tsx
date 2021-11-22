import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import useDarkMode from '../lib/hooks/useDarkMode'
import useMounted from '../lib/hooks/useMounted'
import PreferencesMenu from './PreferencesMenu'
import TransactionMenu from './TransactionMenu'

export interface Props {}

const Layout: FC<Props> = ({ children }) => {
  useDarkMode()
  const mounted = useMounted()
  const { pathname } = useRouter()
  const {
    preferences: { leftHanded },
  } = usePreferences()
  if (!mounted) return null

  return (
    <div
      className="dark:text-white dark:bg-gray-900 relative w-screen h-screen pt-4 pb-4 px-5 grid gap-4"
      style={{
        gridTemplate:
          '"top-menu" auto "main" 1fr "transaction-menu" auto / 1fr',
      }}
    >
      <header
        className={clsx(
          'flex justify-between',

          leftHanded ? 'flex-row-reverse' : null
        )}
        style={{ gridArea: 'top-menu' }}
      >
        <h1 className="font-extrabold text-2xl">⚡ zep</h1>
        <PreferencesMenu />
      </header>
      <main className="overflow-auto" style={{ gridArea: 'main' }}>
        {children}
      </main>
      <div style={{ gridArea: 'transaction-menu' }}>
        {pathname !== '/' && <TransactionMenu />}
      </div>
    </div>
  )
}

export default Layout
