import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { AccountInfoCache } from '../types'

export interface AccountContextValue {
  currAccount: AccountInfoCache | undefined
  accounts: { [key: number]: AccountInfoCache } | undefined
  setAccount: (info: AccountInfoCache) => void
  removeAccount: (index: number) => void
}

const accountContext = createContext<AccountContextValue | undefined>(undefined)

export const useAccounts = () => {
  const contextValue = useContext(accountContext)
  if (contextValue === undefined)
    throw new Error('`useAddress` must be used insisde a context `Provider`')
  return contextValue
}

/**
 * @param index index of the account you want, or no index if you want the current account
 * @returns the requested account, or undefined if no account was found
 */
export const useAccount = (index?: number) => {
  const contextValue = useAccounts()
  return index !== undefined
    ? contextValue.accounts?.[index]
    : contextValue.currAccount
}

export const AccountProvider: FC<{
  initialAccounts?: { [key: number]: AccountInfoCache } | undefined
  initialAccountIndex?: number
}> = ({ children, initialAccounts, initialAccountIndex }) => {
  const [accounts, setAccounts] = useState<
    { [key: number]: AccountInfoCache } | undefined
  >(initialAccounts)
  useEffect(() => {
    setAccounts(initialAccounts)
  }, [initialAccounts])

  const [currAccountIndex, setCurrAccountIndex] = useState<number>(
    initialAccountIndex ?? 0
  )
  useEffect(() => {
    setCurrAccountIndex(initialAccountIndex ?? 0)
  }, [initialAccountIndex])

  const setAccount = useCallback((account: AccountInfoCache) => {
    setAccounts(prev => ({ ...prev, [account.index]: account }))
  }, [])

  const removeAccount = useCallback((index: number) => {
    setAccounts(prev => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }, [])

  const currAccount = accounts?.[currAccountIndex]

  useEffect(() => {
    if (currAccount !== undefined) {
    }
  }, [currAccount])

  return (
    <accountContext.Provider
      value={{
        accounts,
        setAccount,
        removeAccount,
        currAccount,
      }}
    >
      {children}
    </accountContext.Provider>
  )
}
