import { KeyIcon } from '@heroicons/react/solid'
import { FC, forwardRef } from 'react'

export interface Props {
  value: string
  onChange: (value: string) => void
}

const SeedInput: FC<Props> = ({ value, onChange }) => (
  <div className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-primary-50 focus-within:bg-primary-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700">
    <label htmlFor="xno-seed">
      <KeyIcon className="text-gray-900 dark:text-primary-50 h-7" />
    </label>
    <input
      autoFocus
      name="xno-seed"
      id="xno-seed"
      maxLength={128}
      minLength={64}
      className="bg-transparent focus:outline-none w-full"
      value={value}
      pattern="^([0-9a-fA-F]{64}){1,2}$"
      autoComplete="off"
      onChange={({ target: { value, validity } }) => {
        if (!validity.patternMismatch) onChange(value)
      }}
    />
  </div>
)

export default SeedInput
