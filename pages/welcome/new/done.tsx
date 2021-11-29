import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Done: NextPage = () => {
  const { push } = useRouter()
  return (
    <div className="flex flex-col h-full justify-start items-center text-center px-4 gap-2 text-purple-50">
      <h1 className="text-9xl font-extrabold">3</h1>
      <p className="text-3xl">you&apos;re done!</p>
      <p className="text-xl mb-5">
        all the buttons are now enabled and you can start using <b>zep</b> and{' '}
        <b>nano</b>!
      </p>
      <button
        className="dark:bg-gray-900 dark:text-purple-100 py-2 px-5 rounded text-xl bg-purple-50 font-bold text-gray-900"
        onClick={() => push('/dashboard')}
      >
        go!
      </button>
    </div>
  )
}

export default Done
