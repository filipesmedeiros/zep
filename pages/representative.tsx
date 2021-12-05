import { CheckIcon, LibraryIcon } from '@heroicons/react/solid'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import AddressInput from '../components/AddressInput'
import { useAccount } from '../lib/context/accountContext'
import useChangeRepresentative from '../lib/hooks/useChangeRepresentative'
import showNotification from '../lib/showNotification'

const Representative: NextPage = () => {
  const [representativeAddr, setRepresentativeAddr] = useState('')
  const account = useAccount()

  const { changeRep } = useChangeRepresentative()

  return (
    <>
      <Head>
        <title>zep⚡️ - representative</title>
      </Head>
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="flex items-center w-full gap-2">
          <LibraryIcon className="dark:text-purple-50 h-7 xs:h-8 text-gray-900 translate-x-1 transition-colors" />
          <span className="text-3xl sm:text-5xl">representative</span>
        </h1>

        <section className="flex flex-col gap-1">
          <h1 className="text-3xl">current</h1>
          <hr className="w-4/12 rounded" />
          <h2 className="flex-1 text-lg">
            <span className="text-purple-400">
              {account?.representative?.substring(0, 10)}
            </span>
            {account?.representative?.substring(10, 21)}
            <br />
            {account?.representative?.substring(21, 42)}
            <br />
            {account?.representative?.substring(42, 56)}
            <span className="text-purple-400 font-medium">
              {account?.representative?.substring(56)}
            </span>
          </h2>
        </section>

        <section className="flex flex-col gap-2">
          <h1 className="text-3xl">change</h1>
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={async e => {
              e.preventDefault()
              if (representativeAddr !== '') {
                await changeRep(representativeAddr)
                showNotification({
                  title: 'changed representative',
                  body: `you just changed your representative to ${representativeAddr}`,
                })
                setRepresentativeAddr('')
              }
            }}
          >
            <AddressInput
              value={representativeAddr}
              onChange={setRepresentativeAddr}
              representative
            />

            <button
              type="submit"
              aria-label="Trigger biometrics authentication"
              className="hidden xs:flex p-3 items-center dark:bg-gray-800 bg-purple-50 mb-3 rounded shadow hover:cursor-pointer"
            >
              confirm
              <CheckIcon className="h-7 text-gray-900 dark:text-purple-50" />
            </button>
          </form>
        </section>
      </div>
    </>
  )
}

export default Representative
