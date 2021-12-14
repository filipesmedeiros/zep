import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Welcome: NextPage = () => {
  return (
    <>
      <Head>
        <title>zep⚡️ - welcome</title>
      </Head>
      <div className="flex flex-col justify-center w-full h-full text-center text-gray-900 transition-colors dark:text-primary-50">
        <h1 className="mb-3 text-3xl xs:text-5xl font-extrabold">hey!</h1>
        <p className="mb-3 text-xl font-medium">
          do you already have a
          <br />
          <b>nano</b> passphrase?
        </p>

        <div className="flex flex-col justify-center w-full gap-3 mb-3 xs:mb-6">
          <Link href="/welcome/import/register">
            <a className="px-5 py-2 text-lg font-bold text-primary-50 transition-all rounded shadow-lg bg-primary-400 dark:bg-gray-800 dark:text-primary-50 hover:bg-primary-300 dark:hover:bg-gray-800 hover:shadow-md active:shadow">
              i have a passphrase/seed
            </a>
          </Link>
          <Link href="/welcome/new">
            <a className="px-5 py-2 text-lg font-bold text-primary-50 transition-all rounded shadow-lg bg-primary-400 dark:bg-gray-800 dark:text-primary-50 hover:bg-primary-300 dark:hover:bg-gray-800 hover:shadow-md active:shadow">
              what&apos;s a passphrase?
            </a>
          </Link>
        </div>
        <aside className="mb-2 xs:mb-3 text-xs">
          your passphrase will{' '}
          <b className="font-extrabold">
            <em>never</em>
          </b>{' '}
          leave your device,
          <br />
          and will only be decrypted for a few moments to send nano
        </aside>
        <p className="text-xs">
          <em>
            psst: you can already see all the cool buttons below, but
            they&apos;re all disabled for now
          </em>
        </p>
      </div>
    </>
  )
}

export default Welcome
