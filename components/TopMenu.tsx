import {
  CogIcon,
  DotsHorizontalIcon,
  HandIcon,
  KeyIcon,
  MoonIcon
} from '@heroicons/react/solid'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'

import { usePreferences } from '../lib/context/preferencesContext'
import decryptSeed from '../lib/decryptSeed'
import useChallenge from '../lib/hooks/useChallenge'
import useClickAway from '../lib/hooks/useClickAway'
import useCredentialId from '../lib/hooks/useCredentialId'
import useIsWelcoming from '../lib/hooks/useIsWelcoming'
import showNotification from '../lib/showNotification'

export interface Props {}

const TopMenu: FC<Props> = () => {
  const {
    preferences: { darkMode, leftHanded },
    setPreference
  } = usePreferences()

  // todo refactor this into a custom hook?
  const [showPreferences, setShowPreferences] = useState(false)
  const preferencesButtonRef = useRef<HTMLDivElement>(null)
  useClickAway(preferencesButtonRef, () => setShowPreferences(false))
  const [renderPreferences, setRenderPreferences] = useState(false)
  const togglePreferences = () => {
    if (showPreferences) setShowPreferences(false)
    else setRenderPreferences(true)
  }
  useEffect(() => {
    if (renderPreferences) setShowPreferences(true)
  }, [renderPreferences])

  const [showAdvanced, setShowAdvanced] = useState(false)
  const advancedButtonRef = useRef<HTMLDivElement>(null)
  useClickAway(advancedButtonRef, () => setShowAdvanced(false))
  const [renderAdvanced, setRenderAdvanced] = useState(false)
  const advancedRef = useRef<HTMLUListElement>(null)
  const toggleAdvanced = () => {
    if (showAdvanced) setShowAdvanced(false)
    else setRenderAdvanced(true)
  }
  useEffect(() => {
    if (renderAdvanced) setShowAdvanced(true)
  }, [renderAdvanced])

  const isWelcoming = useIsWelcoming()

  const challenge = useChallenge()
  const credentialId = useCredentialId()

  const onCopySeed = async () => {
    const seed = await decryptSeed({
      challenge: challenge!,
      rawId: credentialId!
    })
    await navigator.clipboard.writeText(seed)
    showNotification({
      title: 'seed copied to clipboard',
      body:
        'you just copied your seed to your clipboard, you can use it anywhere',
      tag: 'copy-seed'
    })
  }

  return (
    <div
      className={clsx('flex gap-3 justify-center', {
        'flex-row-reverse': leftHanded
      })}
    >
      {!isWelcoming && (
        <div className="relative z-20" ref={advancedButtonRef}>
          <button
            aria-label="Open adavanced menu"
            className={clsx(
              'w-10 p-1 rounded bg-purple-400 shadow text-purple-50 dark:text-gray-900 hover:cursor-pointer hover:bg-purple-400 transition-colors dark:hover:text-purple-50'
            )}
            onClick={toggleAdvanced}
          >
            <DotsHorizontalIcon className="w-full" />
          </button>
          {renderAdvanced && (
            <ul
              onTransitionEnd={() => {
                if (!showAdvanced) setRenderAdvanced(false)
              }}
              role="menu"
              ref={advancedRef}
              className={clsx(
                'transition-all shadow flex flex-col gap-2 absolute w-10 bg-purple-400 p-1 rounded mt-3 hover:text-white',
                showAdvanced ? 'opacity-100' : 'opacity-0 -translate-y-2'
              )}
            >
              <li>
                <button
                  aria-label="Copy your nano seed to your clipboard"
                  className={clsx(
                    'p-1 rounded transition-colors dark:hover:text-gray-900 w-full hover:bg-purple-300 bg-purple-400 dark:text-gray-900 text-purple-50'
                  )}
                  onClick={onCopySeed}
                >
                  <KeyIcon className="h-full" />
                </button>
              </li>
              {/* <li>
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
              </li>
              <li>
                <button
                  className={clsx(
                    'p-1 rounded transition-colors duration-100 w-full hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-50'
                  )}
                  onClick={onCopySeed}
                >
                  <UsersIcon className="h-full" />
                </button>
              </li> */}
            </ul>
          )}
        </div>
      )}

      <div className="relative z-20" ref={preferencesButtonRef}>
        <button
          aria-label="Open preferences menu"
          className={clsx(
            'w-10 p-1 rounded bg-purple-400 shadow text-purple-50 hover:cursor-pointer hover:bg-purple-400 transition-colors dark:hover:text-purple-50 dark:text-gray-900'
          )}
          onClick={togglePreferences}
        >
          <CogIcon className="w-full" />
        </button>
        {renderPreferences && (
          <ul
            role="menu"
            onTransitionEnd={() => {
              if (!showPreferences) setRenderPreferences(false)
            }}
            className={clsx(
              'transition-all shadow flex flex-col gap-2 absolute w-10 bg-purple-400 p-1 rounded mt-3',
              showPreferences ? 'opacity-100' : 'opacity-0 -translate-y-2'
            )}
          >
            {/* {!isiOS && (
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
            )} */}
            <li role="menuitem">
              <button
                aria-label="Toggle dark mode"
                disabled={!showPreferences}
                className={clsx(
                  'p-1 rounded transition-colors duration-100 w-full dark:hover:text-purple-50 hover:bg-purple-300 dark:text-purple-400 dark:bg-gray-900 bg-purple-400 text-purple-50',
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
                aria-label="Toggle left handed mode"
                disabled={!showPreferences}
                className={clsx(
                  'p-1 rounded transition-colors duration-100 w-full dark:hover:text-purple-50',
                  leftHanded
                    ? 'dark:text-purple-400 dark:bg-gray-900 bg-purple-50 text-purple-400 hover:text-purple-300'
                    : 'text-purple-50 dark:text-gray-900 dark:hover:text-gray-900 hover:bg-purple-300',
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
        )}
      </div>
    </div>
  )
}

export default TopMenu
