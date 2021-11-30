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
    <div className="relative flex flex-col w-screen h-screen px-5 pt-4 pb-4 gap-4 dark:text-purple-50 bg-purple-50 dark:bg-gray-900">
      <header
        className={clsx('flex justify-between items-center', {
          'flex-row-reverse': leftHanded,
        })}
      >
        <div className="flex items-start">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-purple-100">
            zep
          </h1>
          <LightningBoltIcon className="h-4 text-gray-900 dark:text-purple-100" />
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
