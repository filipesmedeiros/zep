import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Done: NextPage = () => {
  const { push } = useRouter()
  return (
    <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-2 text-purple-50">
      <h1 className="font-extrabold text-9xl">3</h1>
      <p className="text-3xl">you&apos;re done!</p>
      <p className="mb-5 text-xl">
        all the buttons are now enabled and you can start using <b>zep</b> and{' '}
        <b>nano</b>!
      </p>
      <button
        className="px-5 py-2 text-xl font-bold text-gray-900 rounded dark:bg-gray-900 dark:text-purple-100 bg-purple-50"
        onClick={() => push('/dashboard')}
      >
        go!
      </button>
    </div>
  )
}

export default Done
