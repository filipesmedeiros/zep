import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import useDarkMode from '../lib/hooks/useDarkMode'
import useMounted from '../lib/hooks/useMounted'
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
  } = usePreferences()
  if (!mounted) return null

  return (
    <div
      className="dark:text-white dark:bg-gray-900 relative w-screen h-screen pt-4 pb-4 px-5 grid gap-4"
      style={{
        gridTemplate:
          '"top-menu" auto "balance" auto "main" 1fr "transaction-menu" auto / 1fr',
      }}
    >
      <header
        className={clsx(
          'flex justify-between',

          leftHanded ? 'flex-row-reverse' : null
        )}
        style={{ gridArea: 'top-menu' }}
      >
        <h1 className="font-extrabold text-2xl text-gray-900">zep</h1>
        <PreferencesMenu />
      </header>
      {pathname !== '/' ? (
        <>
          <div style={{ gridArea: 'balance' }}>
            <Balance />
          </div>
          <main
            className="overflow-auto bg-purple-500 rounded-md border-t-8 border-b-8 border-purple-500 py-6 px-3"
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
