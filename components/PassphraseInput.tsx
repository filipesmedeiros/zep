import { KeyIcon } from '@heroicons/react/solid'
import { FC, forwardRef } from 'react'

export interface Props {
  value: string
  onChange: (value: string) => void
  number: number
  onPaste: (text: string) => void
}

const PassphraseInput: FC<Props> = ({ value, onChange, number, onPaste }) => (
  <div className="flex items-center w-full gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-50 focus-within:bg-purple-100 py-2 px-4 overflow-hidden dark:focus-within:bg-gray-700">
    <label htmlFor={`xno-mnemonic-word-${number}`}>
      <span className="text-gray-900 dark:text-purple-50 h-7">{number}.</span>
    </label>
    <input
      autoFocus={number === 1}
      onPaste={ev => onPaste(ev.clipboardData.getData('text'))}
      name={`xno-mnemonic-word-${number}`}
      id={`xno-mnemonic-word-${number}`}
      className="bg-transparent focus:outline-none w-full"
      value={value}
      autoComplete="off"
      onChange={({ target: { value, validity } }) => {
        if (!validity.patternMismatch) onChange(value)
      }}
    />
  </div>
)

export default PassphraseInput
