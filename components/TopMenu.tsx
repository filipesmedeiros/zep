import { KeyIcon as KeyIconOutline } from '@heroicons/react/outline'
import {
  CogIcon,
  DotsHorizontalIcon,
  HandIcon,
  KeyIcon,
  LibraryIcon,
  MoonIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

import { useAccount } from '../lib/context/accountContext'
import { usePreferences } from '../lib/context/preferencesContext'
import decryptSeed from '../lib/decryptSeed'
import useChallenge from '../lib/hooks/useChallenge'
import useClickAway from '../lib/hooks/useClickAway'
import useCredentialId from '../lib/hooks/useCredentialId'
import useEncryptedSeed from '../lib/hooks/useEncryptedSeed'
import useIsWelcoming from '../lib/hooks/useIsWelcoming'
import showNotification from '../lib/showNotification'
import Button from './Button'
import ButtonLink from './ButtonLink'

export interface Props {}

const TopMenu: FC<Props> = () => {
  const {
    preferences: { darkMode, leftHanded },
    setPreference,
  } = usePreferences()
  const isWelcoming = useIsWelcoming()

  const account = useAccount()
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()
  const { encryptedSeed } = useEncryptedSeed()

  // todo refactor this into a custom hook?
  const [showPreferences, setShowPreferences] = useState(false)
  const preferencesButtonRef = useClickAway<HTMLDivElement>(() =>
    setShowPreferences(false)
  )
  const [renderPreferences, setRenderPreferences] = useState(false)
  const togglePreferences = () => {
    if (showPreferences) setShowPreferences(false)
    else setRenderPreferences(true)
  }
  useEffect(() => {
    if (renderPreferences) setShowPreferences(true)
  }, [renderPreferences])

  const [showAdvanced, setShowAdvanced] = useState(false)
  const advancedButtonRef = useClickAway<HTMLDivElement>(() =>
    setShowAdvanced(false)
  )
  const [renderAdvanced, setRenderAdvanced] = useState(false)
  const advancedRef = useRef<HTMLUListElement>(null)
  const toggleAdvanced = () => {
    if (showAdvanced) setShowAdvanced(false)
    else setRenderAdvanced(true)
  }
  useEffect(() => {
    if (renderAdvanced) setShowAdvanced(true)
  }, [renderAdvanced])

  const [storedSeedForCopy, setStoredSeedForCopy] = useState<string>()

  const onCopySeed = async () => {
    const seed = await decryptSeed({
      challenge: challenge!,
      rawId: credentialId!,
      encryptedSeed: encryptedSeed!,
    })

    try {
      await navigator.clipboard.writeText(seed)
      showNotification({
        title: 'seed copied to clipboard',
        body: 'you just copied your seed to your clipboard, you can use it anywhere',
        tag: 'copy-seed',
      })
    } catch {
      showNotification({
        title: 'click on the new button to copy seed',
        body: 'your browser requires a new user action to copy the seed!',
        tag: 'copy-seed',
      })
      setStoredSeedForCopy(seed)
    }
  }

  const onCopySeedSecondAction = async () => {
    await navigator.clipboard.writeText(storedSeedForCopy ?? '')
    showNotification({
      title: 'seed copied to clipboard',
      body: 'you just copied your seed to your clipboard, you can use it anywhere',
      tag: 'copy-seed',
    })
    setStoredSeedForCopy(undefined)
  }

  const canChangeRep = (account?.frontier ?? null) !== null

  return (
    <div
      className={clsx('flex gap-3 justify-center', {
        'flex-row-reverse': leftHanded,
      })}
    >
      {!isWelcoming && (
        <div className="relative z-20" ref={advancedButtonRef}>
          <Button
            variant="primary"
            onClick={toggleAdvanced}
            aria-label="Open adavanced menu"
          >
            <DotsHorizontalIcon className="w-8" />
          </Button>
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
              <li role="menuitem">
                <Button
                  aria-label="Copy your nano seed to your clipboard"
                  variant="primary"
                  onClick={
                    storedSeedForCopy !== undefined
                      ? onCopySeedSecondAction
                      : onCopySeed
                  }
                >
                  {storedSeedForCopy !== undefined ? (
                    <KeyIconOutline className="h-6" />
                  ) : (
                    <KeyIcon className="w-6" />
                  )}
                </Button>
              </li>
              {canChangeRep && (
                <li role="menuitem">
                  <ButtonLink
                    href="/representative"
                    aria-label="see and change you representative"
                    variant="primary"
                    onClick={() => setShowAdvanced(false)}
                    className="block"
                  >
                    <LibraryIcon className="w-6" />
                  </ButtonLink>
                </li>
              )}
              {/* <li>
                <button
                  className={clsx(
                    'p-1 rounded transition-colors duration-100 w-full hover:text-purple-400 bg-purple-400 dark:text-gray-900 text-purple-50 dark:hover:text-purple-50'
                  )}
                >
                  <UsersIcon className="h-full" />
                </button>
              </li> */}
            </ul>
          )}
        </div>
      )}

      <div className="relative z-20" ref={preferencesButtonRef}>
        <Button
          variant="primary"
          onClick={togglePreferences}
          aria-label="Open preferences menu"
        >
          <CogIcon className="w-8" />
        </Button>
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
            <li role="menuitem">
              <Button
                aria-label="Toggle dark mode"
                variant="primary"
                toggledOn={darkMode}
                onClick={() => setPreference('darkMode', !darkMode)}
              >
                <MoonIcon className="w-6" />
              </Button>
            </li>
            <li role="menuitem">
              <Button
                aria-label="Toggle left handed mode"
                variant="primary"
                toggledOn={leftHanded}
                onClick={() => setPreference('leftHanded', !leftHanded)}
              >
                <HandIcon className="w-6" />
              </Button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default TopMenu
