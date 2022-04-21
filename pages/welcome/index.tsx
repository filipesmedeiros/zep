import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Welcome: NextPage = () => {
  return (
    <>
      <Head>
        <title>zep⚡️ - welcome</title>
      </Head>
      <div className="flex flex-col justify-between py-20 w-full h-full text-center text-gray-900 transition-colors dark:text-purple-50">
        <h1 className="mb-3 text-3xl xs:text-5xl font-extrabold">Hey!</h1>
        <p className="mb-3 text-xl font-medium">
          Do you already have a
          <br />
          <b>nano</b> passphrase?
        </p>

        <div className="flex flex-col justify-center w-full gap-3 mb-3 xs:mb-6">
          <Link href="/welcome/import/register">
            <a className="px-5 py-2 text-lg font-bold text-purple-50 transition-all rounded shadow-lg bg-purple-400 dark:bg-gray-800 dark:text-purple-50 hover:bg-purple-300 dark:hover:bg-gray-800 hover:shadow-md active:shadow">
              I have a passphrase/seed
            </a>
          </Link>
          <Link href="/welcome/new">
            <a className="px-5 py-2 text-lg font-bold text-purple-50 transition-all rounded shadow-lg bg-purple-400 dark:bg-gray-800 dark:text-purple-50 hover:bg-purple-300 dark:hover:bg-gray-800 hover:shadow-md active:shadow">
              What&apos;s a passphrase?
            </a>
          </Link>
        </div>
        <aside className="mb-2 xs:mb-3 text-xs">
          Your passphrase will{' '}
          <b className="font-extrabold">
            <em>never</em>
          </b>{' '}
          leave your device, and will only be decrypted for an instant to send
          and receive nano.
        </aside>
      </div>
    </>
  )
}

export default Welcome
