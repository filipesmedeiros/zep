import { LightningBoltIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import useListenToColorMedia from '../lib/hooks/useListenToColorMedia'
import Balance from './Balance'
import BottomMenu from './BottomMenu'
import TopMenu from './TopMenu'

export interface Props {}

const Layout: FC<Props> = ({ children }) => {
  const { pathname } = useRouter()
  const {
    preferences: { leftHanded },
  } = usePreferences()

  useListenToColorMedia()

  return (
    <div className="dark:text-purple-50 bg-purple-50 dark:bg-gray-900 relative w-screen h-screen pt-4 pb-4 px-5 flex flex-col gap-4">
      <header
        className={clsx('flex justify-between items-center', {
          'flex-row-reverse': leftHanded,
        })}
      >
        <div className="flex items-start">
          <h1 className="font-extrabold text-2xl text-gray-900 dark:text-purple-100">
            zep
          </h1>
          <LightningBoltIcon className="text-gray-900 dark:text-purple-100 h-4" />
        </div>
        <TopMenu />
      </header>
      {pathname !== '/' ? (
        <>
          <Balance />
          <hr className="w-3/4 border-2" />
          {children}
          <BottomMenu />
        </>
      ) : (
        <main className="pt-32">{children}</main>
      )}
    </div>
  )
}

export default Layout
