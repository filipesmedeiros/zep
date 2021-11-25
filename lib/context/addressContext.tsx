import { FC, createContext, useContext, useEffect, useState } from 'react'

export interface AddressContextValue {
  address: string | undefined
  setAddress: (address: string) => void
}

const addressContext = createContext<AddressContextValue | undefined>(undefined)

export const useAddress = () => {
  const contextValue = useContext(addressContext)
  if (contextValue === undefined)
    throw new Error('`useAddress` must be used insisde a context `Provider`')
  return contextValue
}

export const AddressProvider: FC<{ address?: string }> = ({
  children,
  address: initialAddress,
}) => {
  const [address, setAddress] = useState<string | undefined>(initialAddress)
  useEffect(() => {
    setAddress(initialAddress)
  }, [initialAddress])

  return (
    <addressContext.Provider value={{ address, setAddress }}>
      {children}
    </addressContext.Provider>
  )
}
