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
    <div className="relative flex flex-col w-full h-full fixed gap-4 px-5 pt-4 pb-4 dark:text-purple-50 bg-white dark:bg-gray-900 transition-colors">
      <header
        className={clsx('flex justify-between items-center', {
          'flex-row-reverse': leftHanded,
        })}
      >
        <div className="flex items-start text-gray-900 transition-colors dark:text-purple-100">
          <h1 className="text-2xl font-extrabold ">zep</h1>
          <LightningBoltIcon className="h-4" />
        </div>
        <TopMenu />
      </header>
      {pathname !== '/' ? (
        <>
          <Balance />
          <hr className="w-1/3 border-2 border-gray-900 dark:border-purple-50 rounded-l-sm rounded-r transition-colors" />
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
