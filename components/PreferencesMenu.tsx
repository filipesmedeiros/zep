import {
  CogIcon,
  FingerPrintIcon,
  HandIcon,
  MoonIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import useClickAway from '../lib/hooks/useClickAway'

export interface Props {}

const PreferencesMenu: FC<Props> = () => {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(prev => !prev)

  const menuRef = useRef<HTMLDivElement>(null)
  useClickAway(menuRef, () => setShowMenu(false))
  const {
    preferences: { darkMode, biometricsAuth, leftHanded },
    togglePreference,
  } = usePreferences()

  return (
    <div className={clsx('relative', leftHanded ? '' : '')} ref={menuRef}>
      <button
        className="w-8 p-1 rounded bg-purple-500 shadow-md text-white hover:cursor-pointer hover:bg-purple-400 transition-colors mb-3"
        onClick={toggleMenu}
      >
        <CogIcon className="w-full" />
      </button>
      <ul
        role="menu"
        className={clsx(
          'transition-all flex flex-col gap-2 absolute w-8',
          showMenu ? 'opacity-100' : 'opacity-0 -translate-y-2'
        )}
      >
        <li role="menuitem">
          <button
            disabled={!showMenu}
            className={clsx(
              'p-1 rounded dark:hover:text-purple-300 transition-colors duration-100 w-full',
              biometricsAuth
                ? 'dark:text-purple-500 dark:bg-white dark:hover:text-purple-500 bg-purple-500 shadow-md text-white hover:bg-purple-400'
                : 'hover:text-purple-500',
              showMenu ? 'hover:cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              togglePreference('biometricsAuth')
              setShowMenu(false)
            }}
          >
            <FingerPrintIcon className="h-full" />
          </button>
        </li>
        <li role="menuitem">
          <button
            disabled={!showMenu}
            className={clsx(
              'p-1 rounded dark:hover:text-purple-300 transition-colors duration-100 w-full',
              darkMode
                ? 'dark:text-purple-500 dark:bg-white dark:hover:text-purple-400'
                : 'hover:text-purple-500',
              showMenu ? 'hover:cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              togglePreference('darkMode')
              setShowMenu(false)
            }}
          >
            <MoonIcon className="h-full" />
          </button>
        </li>
        <li role="menuitem">
          <button
            disabled={!showMenu}
            className={clsx(
              'p-1 rounded dark:hover:text-purple-300 transition-colors duration-100 w-full',
              leftHanded
                ? 'dark:text-purple-500 dark:bg-white dark:hover:text-purple-400'
                : 'hover:text-purple-500',
              showMenu ? 'hover:cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              togglePreference('leftHanded')
              setShowMenu(false)
            }}
          >
            <HandIcon className="h-full" />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default PreferencesMenu
