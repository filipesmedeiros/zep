import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import computeWorkAsync from '../computeWorkAsync'
import {
  addPrecomputedWork,
  consumePrecomputedWork,
  getAllAccounts,
  putAccount,
} from '../db/accounts'
import { AccountInfoCache } from '../types'
import fetchAccountInfo from '../xno/fetchAccountInfo'

export interface AccountContextValue {
  currAccount: AccountInfoCache | undefined
  accounts: { [index: number]: AccountInfoCache } | undefined
  setAccount: (info: AccountInfoCache) => void
  removeAccount: (index: number) => void
  setCurrAccountIndex: (index: number) => void
}

const accountContext = createContext<AccountContextValue | undefined>(undefined)

const refreshAccountFromNetwork = async (account: AccountInfoCache) => {
  const infoResponse = await fetchAccountInfo(account.address)

  const frontier =
    'error' in infoResponse ? null : infoResponse.confirmed_frontier
  const representative =
    'error' in infoResponse ? null : infoResponse.confirmed_representative
  const balance =
    'error' in infoResponse ? null : infoResponse.confirmed_balance
  const freshAccountInfo = {
    ...account,
    frontier,
    representative,
    balance,
  }
  const diff =
    account.frontier !== frontier ||
    account.representative !== representative ||
    account.balance !== balance

  if (diff) putAccount(freshAccountInfo)

  return { freshAccountInfo, diff }
}

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

export const useCurrentAccount = () => useAccount()

export const AccountProvider: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<{ [key: number]: AccountInfoCache }>(
    {}
  )

  const setAccount = useCallback((account: AccountInfoCache) => {
    setAccounts(prev => ({ ...prev, [account.index]: account }))
    // todo handle error
    putAccount(account)
  }, [])

  useEffect(() => {
    const refreshAccountsFromNetwork = async (accounts: AccountInfoCache[]) =>
      accounts.forEach(async account => {
        const { freshAccountInfo, diff } = await refreshAccountFromNetwork(
          account
        )
        if (diff) setAccount(freshAccountInfo)
      })

    const getAccountsFromIdb = async () => {
      const accountList = await getAllAccounts()
      const accounts: AccountContextValue['accounts'] = {}
      accountList.forEach(async account => {
        accounts[account.index] = account
        if (account.precomputedWork === null) {
          const work = await computeWorkAsync(
            account.frontier ?? account.publicKey,
            {
              send: account.frontier !== null,
            }
          )

          if (work !== null) {
            setAccounts(prev => ({
              ...prev,
              [account.index]: {
                ...prev[account.index],
                precomputedWork: work,
              },
            }))
            addPrecomputedWork(account.address, work)
          }
        }
      })
      setAccounts(accounts)
      refreshAccountsFromNetwork(accountList)
    }
    getAccountsFromIdb()
  }, [setAccount])

  const [currAccountIndex, setCurrAccountIndex] = useState<number>(0)
  const currAccount = useMemo(
    () => accounts?.[currAccountIndex],
    [currAccountIndex, accounts]
  )

  const removeAccount = useCallback((index: number) => {
    setAccounts(prev => {
      const next = { ...prev }
      delete next[index]
      return next
    })
    // todo handle error
    removeAccount(index)
  }, [])

  return (
    <accountContext.Provider
      value={{
        accounts,
        setAccount,
        removeAccount,
        currAccount,
        setCurrAccountIndex,
      }}
    >
      {children}
    </accountContext.Provider>
  )
}
