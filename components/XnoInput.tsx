import Big from 'bignumber.js'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'

// delete if not needed
export interface Props {
  value: string
  onChange: (value: string) => void
}

Big.config({ EXPONENTIAL_AT: 1e9 })
const bigToConvert = new Big(`1${'0'.repeat(30)}`)

const XnoInput: FC<Props> = ({ value, onChange }) => {
  const { query, replace, pathname } = useRouter()

  const onInputChange = useCallback(
    (value: string) => {
      onChange(value)
      replace({
        pathname,
        query: {
          ...query,
          amount:
            value !== ''
              ? new Big(value).times(bigToConvert).toString() // since nanocurrency-js can't handle decimals :(
              : '',
        },
      })
    },
    [replace, pathname, query, onChange]
  )

  return (
    <div className="flex items-center gap-3 text-2xl rounded transition-colors dark:bg-gray-800 bg-purple-50 focus-within:bg-purple-100 py-2 px-4 w-48 overflow-hidden dark:focus-within:bg-gray-700">
      <label htmlFor="xno-amount">Ӿ</label>
      <input
        name="xno-amount"
        id="xno-amount"
        maxLength={15}
        className="bg-transparent focus:outline-none"
        value={value}
        pattern="[0-9]*[\.,]?[0-9]{0,6}"
        step="0.000001"
        autoComplete="off"
        onChange={({ target: { value, validity } }) => {
          if (!validity.patternMismatch) onInputChange(value)
        }}
      />
    </div>
  )
}

export default XnoInput
