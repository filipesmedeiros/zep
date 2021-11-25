import {
  CogIcon,
  FingerPrintIcon,
  HandIcon,
  MoonIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useRef, useState } from 'react'
import colors from 'tailwindcss/colors'

import { usePreferences } from '../lib/context/preferencesContext'
import useClickAway from '../lib/hooks/useClickAway'
import useIsiOS from '../lib/hooks/useIsiOS'

export interface Props {}

const PreferencesMenu: FC<Props> = () => {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(prev => !prev)

  const menuRef = useRef<HTMLDivElement>(null)
  useClickAway(menuRef, () => setShowMenu(false))
  const {
    preferences: { darkMode, biometricsAuth, leftHanded },
    setPreference,
  } = usePreferences()

  const isiOS = useIsiOS()

  return (
    <div className="relative z-20 justify-center" ref={menuRef}>
      <button
        className={clsx(
          'w-10 p-1 rounded bg-purple-500 shadow-md text-purple-50 dark:text-gray-900 hover:cursor-pointer hover:bg-purple-400 transition-colors dark text-purple-50:dark:text-gray-900'
        )}
        onClick={toggleMenu}
      >
        <CogIcon className="w-full" />
      </button>
      <ul
        role="menu"
        className={clsx(
          'transition-all flex flex-col gap-2 absolute w-10 bg-purple-400 p-1 rounded mt-3',
          showMenu ? 'opacity-100' : 'opacity-0 -translate-y-2'
        )}
        style={{
          boxShadow: `${colors.coolGray[900]} 0px 2px 15px`,
        }}
      >
        {!isiOS && (
          <li role="menuitem">
            <button
              disabled={!showMenu}
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full',
                biometricsAuth
                  ? 'dark:text-purple-400 dark:bg-gray-900 dark:hover:text-purple-400 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                  : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-300',
                showMenu ? 'hover:cursor-pointer' : 'cursor-default'
              )}
              onClick={() => {
                setPreference('biometricsAuth', !biometricsAuth)
                setShowMenu(false)
              }}
            >
              <FingerPrintIcon className="h-full" />
            </button>
          </li>
        )}
        <li role="menuitem">
          <button
            disabled={!showMenu}
            className={clsx(
              'p-1 rounded transition-colors duration-100 w-full',
              darkMode
                ? 'dark:text-purple-400 dark:bg-gray-900 dark:hover:text-purple-400 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-300',
              showMenu ? 'hover:cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              setPreference('darkMode', !darkMode)
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
              'p-1 rounded transition-colors duration-100 w-full',
              leftHanded
                ? 'dark:text-purple-400 dark:bg-gray-900 dark:hover:text-purple-400 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 dark:hover:text-purple-300 text-purple-50',
              showMenu ? 'hover:cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              setPreference('leftHanded', !leftHanded)
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
