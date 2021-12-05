import { LibraryIcon } from '@heroicons/react/solid'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

import AddressInput from '../components/AddressInput'
import { useAccount } from '../lib/context/accountContext'
import useChallenge from '../lib/hooks/useChallenge'
import useChangeRepresentative from '../lib/hooks/useChangeRepresentative'
import useCredentialId from '../lib/hooks/useCredentialId'
import showNotification from '../lib/showNotification'

const Representative: NextPage = () => {
  const [representativeAddr, setRepresentativeAddr] = useState('')
  const account = useAccount()

  const { changeRep } = useChangeRepresentative()
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

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
            onSubmit={async e => {
              e.preventDefault()
              if (representativeAddr !== '') {
                await changeRep(representativeAddr, {
                  challenge: challenge!,
                  rawId: credentialId!,
                })
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
          </form>
        </section>
      </div>
    </>
  )
}

export default Representative
