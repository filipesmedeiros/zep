import { useEffect, useRef } from 'react'

const useClickAway = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null)
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
