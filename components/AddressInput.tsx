import { LibraryIcon } from '@heroicons/react/solid'
import { FC, InputHTMLAttributes } from 'react'

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  representative?: boolean
}

const AddressInput: FC<Props> = ({
  value,
  onChange,
  representative = false,
  ...inputProps
}) => (
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
      autoComplete="off"
      autoCorrect="off"
      className="bg-transparent focus:outline-none w-full"
      value={value}
      onChange={({ target }) => onChange(target.value)}
      {...inputProps}
    />
  </div>
)

export default AddressInput
