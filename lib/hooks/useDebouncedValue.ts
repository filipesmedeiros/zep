import { useEffect, useRef, useState } from 'react'

// from https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-debounced-value/use-debounced-value.ts
const useDebouncedValue = <T = any>(
  value: T,
  wait: number,
  options = { leading: false }
) => {
  const [_value, setValue] = useState(value)

  const timeoutRef = useRef<number>()
  const cooldownRef = useRef(false)

  const cancel = () => window.clearTimeout(timeoutRef.current!)

  useEffect(() => {
    if (!cooldownRef.current && options.leading) {
      cooldownRef.current = true
      setValue(value)
    } else {
      if (timeoutRef.current !== undefined) cancel()
      timeoutRef.current = window.setTimeout(() => {
        cooldownRef.current = false
        setValue(value)
      }, wait)
    }
  }, [value, options.leading, wait])

  useEffect(() => {
    if (timeoutRef.current !== undefined) return cancel
  }, [])

  return [_value, cancel] as const
}

export default useDebouncedValue
