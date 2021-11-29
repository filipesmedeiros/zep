import {
  CogIcon,
  DotsHorizontalIcon,
  FingerPrintIcon,
  HandIcon,
  KeyIcon,
  LibraryIcon,
  MoonIcon,
  UsersIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useRef, useState } from 'react'
import colors from 'tailwindcss/colors'

import { usePreferences } from '../lib/context/preferencesContext'
import decryptSeed from '../lib/decryptSeed'
import useClickAway from '../lib/hooks/useClickAway'
import useIsWelcoming from '../lib/hooks/useIsWelcoming'
import useIsiOS from '../lib/hooks/useIsiOS'

export interface Props {}

const TopMenu: FC<Props> = () => {
  const [showPreferences, setShowPreferences] = useState(false)
  const togglePreferences = () => setShowPreferences(prev => !prev)

  const preferencesRef = useRef<HTMLDivElement>(null)
  useClickAway(preferencesRef, () => setShowPreferences(false))
  const {
    preferences: { darkMode, biometricsAuth, leftHanded },
    setPreference,
  } = usePreferences()

  const [showAdvanced, setShowAdvanced] = useState(false)
  const toggleAdvanced = () => setShowAdvanced(prev => !prev)

  const advancedRef = useRef<HTMLDivElement>(null)
  useClickAway(advancedRef, () => setShowAdvanced(false))

  const isiOS = useIsiOS()
  const isWelcoming = useIsWelcoming()

  const onCopySeed = async () => {
    const seed = await decryptSeed('os')
    navigator.clipboard.writeText(seed)
  }

  return (
    <div
      className={clsx('flex gap-3 justify-center', {
        'flex-row-reverse': leftHanded,
      })}
    >
      {!isWelcoming && (
        <div className="relative z-20" ref={advancedRef}>
          <button
            className={clsx(
              'w-10 p-1 rounded bg-purple-500 shadow-md text-purple-50 dark:text-gray-900 hover:cursor-pointer hover:bg-purple-400 transition-colors dark:hover:text-purple-50'
            )}
            onClick={toggleAdvanced}
          >
            <DotsHorizontalIcon className="w-full" />
          </button>
          <ul
            role="menu"
            className={clsx(
              'transition-all flex flex-col gap-2 absolute w-10 bg-purple-400 p-1 rounded mt-3 hover:text-white',
              showAdvanced ? 'opacity-100' : 'opacity-0 -translate-y-2'
            )}
            style={{
              boxShadow: `${colors.coolGray[900]} 0px 2px 15px`,
            }}
          >
            <button
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-50'
              )}
              onClick={onCopySeed}
            >
              <KeyIcon className="h-full" />
            </button>
            <button
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-50'
              )}
              onClick={() => {
                // todo
              }}
            >
              <LibraryIcon className="h-full" />
            </button>
            <button
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-50'
              )}
              onClick={onCopySeed}
            >
              <UsersIcon className="h-full" />
            </button>
          </ul>
        </div>
      )}

      <div className="relative z-20" ref={preferencesRef}>
        <button
          className={clsx(
            'w-10 p-1 rounded bg-purple-500 shadow-md text-purple-50 hover:cursor-pointer hover:bg-purple-400 transition-colors dark:hover:text-purple-50 dark:text-gray-900'
          )}
          onClick={togglePreferences}
        >
          <CogIcon className="w-full" />
        </button>
        <ul
          role="menu"
          className={clsx(
            'transition-all flex flex-col gap-2 absolute w-10 bg-purple-400 p-1 rounded mt-3',
            showPreferences ? 'opacity-100' : 'opacity-0 -translate-y-2'
          )}
          style={{
            boxShadow: `${colors.coolGray[900]} 0px 2px 15px`,
          }}
        >
          {!isiOS && (
            <li role="menuitem">
              <button
                disabled={!showPreferences}
                className={clsx(
                  'p-1 rounded transition-colors duration-100 w-full dark:hover:text-purple-50',
                  biometricsAuth
                    ? 'dark:text-purple-400 dark:bg-gray-900 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                    : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50',
                  showPreferences ? 'hover:cursor-pointer' : 'cursor-default'
                )}
                onClick={() => {
                  setPreference('biometricsAuth', !biometricsAuth)
                  setShowPreferences(false)
                }}
              >
                <FingerPrintIcon className="h-full" />
              </button>
            </li>
          )}
          <li role="menuitem">
            <button
              disabled={!showPreferences}
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full dark:hover:text-purple-50',
                darkMode
                  ? 'dark:text-purple-400 dark:bg-gray-900 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                  : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50',
                showPreferences ? 'hover:cursor-pointer' : 'cursor-default'
              )}
              onClick={() => {
                setPreference('darkMode', !darkMode)
                setShowPreferences(false)
              }}
            >
              <MoonIcon className="h-full" />
            </button>
          </li>
          <li role="menuitem">
            <button
              disabled={!showPreferences}
              className={clsx(
                'p-1 rounded transition-colors duration-100 w-full dark:hover:text-purple-50',
                leftHanded
                  ? 'dark:text-purple-400 dark:bg-gray-900 shadow-md hover:bg-purple-400 bg-purple-50 text-purple-400'
                  : 'hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50',
                showPreferences ? 'hover:cursor-pointer' : 'cursor-default'
              )}
              onClick={() => {
                setPreference('leftHanded', !leftHanded)
                setShowPreferences(false)
              }}
            >
              <HandIcon className="h-full" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TopMenu
