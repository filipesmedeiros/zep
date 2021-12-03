import { FC } from 'react'

// delete if not needed
export interface Props {
  value: string
  onChange: (value: string) => void
}

const AddressInput: FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-50 focus-within:bg-purple-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700">
      <label htmlFor="xno-address">@</label>
      <input
        name="xno-address"
        id="xno-address"
        maxLength={65}
        minLength={65}
        className="bg-transparent focus:outline-none w-full"
        value={value}
        pattern="^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$"
        onChange={({ target: { value, validity } }) => {
          if (!validity.patternMismatch) onChange(value)
        }}
      />
    </div>
  )
}

export default AddressInput
