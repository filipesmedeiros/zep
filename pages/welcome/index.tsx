import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Welcome: NextPage = () => {
  const { push } = useRouter()
  return (
    <div className="flex flex-col justify-center w-full h-full text-center text-purple-50">
      <h1 className="mb-3 text-4xl font-bold">hey!</h1>
      <p className="mb-2 text-xl font-medium">
        do you already have
        <br />a <b>nano</b> passphrase
        <br />
        you wanna use?
      </p>
      <aside className="mb-3 text-xs">
        your passphrase will{' '}
        <b className="font-extrabold">
          <em>never</em>
        </b>{' '}
        leave your device,
        <br />
        and will only be decrypted for a few moments to send nano
      </aside>
      <div className="flex flex-col justify-center w-full mb-6 gap-3">
        <button className="px-5 py-2 text-lg font-bold text-gray-900 rounded shadow-lg dark:bg-gray-900 bg-purple-50 dark:hover:bg-gray-800 hover:shadow-md active:shadow transition-all duration-100 dark:text-purple-50">
          i have a passphrase/seed
        </button>
        <button
          className="px-5 py-2 text-lg font-bold text-gray-900 rounded shadow-lg dark:bg-gray-900 bg-purple-50 dark:hover:bg-gray-800 hover:shadow-md active:shadow transition-all duration-100 dark:text-purple-50"
          onClick={() => push('/welcome/new')}
        >
          what&apos;s a passphrase?
        </button>
      </div>
      <p className="text-xs">
        <em>
          psst: you can already see all the cool buttons below, but they&apos;re
          all disabled for now
        </em>
      </p>
    </div>
  )
}

export default Welcome
