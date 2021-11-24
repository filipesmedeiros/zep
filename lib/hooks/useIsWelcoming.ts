import { useRouter } from 'next/router'

const useIsWelcoming = () => useRouter().pathname === '/welcome'

export default useIsWelcoming
