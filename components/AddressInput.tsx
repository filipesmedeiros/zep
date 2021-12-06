import { LibraryIcon } from '@heroicons/react/solid'
import { FC } from 'react'

// delete if not needed
export interface Props {
  value: string
  onChange: (value: string) => void
  representative?: boolean
}

const AddressInput: FC<Props> = ({
  value,
  onChange,
  representative = false,
}) => {
  return (
    <div className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-50 focus-within:bg-purple-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700">
      <label htmlFor="xno-address">
        {representative ? (
          <LibraryIcon className="text-gray-900 dark:text-purple-50 h-7" />
        ) : (
          '@'
        )}
      </label>
      <input
        name="xno-address"
        id="xno-address"
        maxLength={65}
        minLength={65}
        autoComplete="off"
        className="bg-transparent focus:outline-none w-full"
        value={value}
        pattern="^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$"
        onChange={({ target }) => {
          if (!target.validity.patternMismatch) onChange(target.value)
          else {
            target.setCustomValidity('just paste an address here!')
            target.reportValidity()
          }
        }}
      />
    </div>
  )
}

export default AddressInput
