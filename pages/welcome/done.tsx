import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import ButtonLink from '../../components/ButtonLink'

const Done: NextPage = () => (
  <>
    <Head>
      <title>zep⚡️ - welcome</title>
    </Head>

    <header className="flex flex-col items-center justify-start flex-1 px-4 text-center gap-6 text-gray-900 dark:text-purple-50 transition-colors">
      <h1 className="font-extrabold text-7xl xs:text-8xl">3</h1>
      <h2 className="font-extrabold text-2xl xs:text-4xl">you&apos;re done!</h2>
      <h3 className="text-lg">
        all the buttons are now enabled and you can start using <b>zep</b> and{' '}
        <b>nano</b>!
      </h3>
      <ButtonLink
        href="/dashboard"
        className="!text-xl xs:!text-3xl py-1 xs:py-3 px-6"
        aria-label="go to your dashboard"
      >
        go!
      </ButtonLink>
    </header>
  </>
)

export default Done
