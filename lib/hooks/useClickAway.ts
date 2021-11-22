import { RefObject, useEffect, useRef } from 'react'

const useClickAway = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node | null)) callback()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [callback, ref])

  return ref
}

export default useClickAway
