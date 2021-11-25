import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Welcome: NextPage = () => {
  const { push } = useRouter()
  return (
    <div className="w-full text-center flex flex-col justify-center h-full">
      <h1 className="text-4xl mb-3 font-bold">hey!</h1>
      <p className="text-xl font-medium mb-2">
        do you already have
        <br />a <b>nano</b> seed you wanna use?
      </p>
      <aside className="text-xs mb-5">
        your seed will{' '}
        <b className="font-extrabold">
          <em>never</em>
        </b>{' '}
        leave your device,
        <br />
        and will only be decrypted for a few moments to send nano
      </aside>
      <div className="flex flex-col gap-3 justify-center w-full mb-6">
        <button className="dark:bg-gray-900 bg-white dark:hover:bg-gray-800 py-2 px-5 rounded text-3xl font-bold shadow-lg hover:shadow-md active:shadow transition-all duration-100">
          i have a seed
        </button>
        <button
          className="dark:bg-gray-900 bg-white dark:hover:bg-gray-800 py-2 px-5 rounded text-3xl font-bold shadow-lg hover:shadow-md active:shadow transition-all duration-100"
          onClick={() => push('/welcome/new')}
        >
          give me a seed
        </button>
      </div>
      <p className="text-xs">
        <em>
          psst: you can already see all the cool buttons below,
          <br />
          but they&apos;re all disabled for now
        </em>
      </p>
    </div>
  )
}

export default Welcome