import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Done: NextPage = () => {
  const { push } = useRouter()
  return (
    <div className="flex flex-col h-full justify-start items-center text-center px-4 gap-2">
      <h1 className="text-9xl font-extrabold">3</h1>
      <p className="text-3xl">you&apos;re done!</p>
      <p className="text-xl">
        all the buttons are now enabled and you can start using zep and nano!
      </p>
    </div>
  )
}

export default Done
