import { useRouter } from 'next/router'

const useIsWelcoming = () => useRouter().pathname.startsWith('/welcome')

export default useIsWelcoming
