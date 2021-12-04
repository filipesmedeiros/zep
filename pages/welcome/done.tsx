import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Done: NextPage = () => {
  const { push } = useRouter()
  return (
    <>
      <Head>
        <title>zep⚡️ - welcome</title>
      </Head>
      <div className="flex flex-col items-center justify-start h-full px-4 text-center gap-2 text-gray-900 transition-colors dark:text-purple-50">
        <h1 className="font-extrabold text-9xl">3</h1>
        <p className="text-3xl">you&apos;re done!</p>
        <p className="mb-5 text-xl">
          all the buttons are now enabled and you can start using <b>zep</b> and{' '}
          <b>nano</b>!
        </p>
        <Link href="/dashboard">
          <a className="px-5 py-2 text-xl font-bold bg-purple-400 transition-colors text-purple-50 rounded dark:bg-gray-800">
            go! <span className="hidden">to your dashboard</span>
          </a>
        </Link>
      </div>
    </>
  )
}

export default Done
