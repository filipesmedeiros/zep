import { useRouter } from 'next/router'

const useIsWelcoming = () => {
  const { pathname } = useRouter()
  return pathname.startsWith('/welcome') && !pathname.endsWith('/done')
}

export default useIsWelcoming
