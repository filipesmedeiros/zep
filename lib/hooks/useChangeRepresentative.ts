import { validateWork } from 'nanocurrency'
import { useCallback, useState } from 'react'

import computeWorkAsync from '../computeWorkAsync'
import { useAccount, useAccounts } from '../context/accountContext'
import { consumePrecomputedWork, getPrecomputedWork } from '../db/accounts'
import changeRepresentative from '../xno/changeRepresentative'
import useChallenge from './useChallenge'
import useCredentialId from './useCredentialId'
import useEncryptedSeed from './useEncryptedSeed'

const useChangeRepresentative = () => {
  const account = useAccount()
  const { setAccount } = useAccounts()
  const [generatingWork, setGeneratingWork] = useState(false)

  const { encryptedSeed } = useEncryptedSeed()
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const changeRep = useCallback(
    async (newRepresentative: string) => {
      if (
        account === undefined ||
        account.balance === null ||
        account.representative === null ||
        account.frontier === null
      )
        throw new Error('wrong_block_data') // todo improve this error
      let precomputedWork = await getPrecomputedWork(account.address)
      const isWorkValid =
        precomputedWork !== null &&
        validateWork({
          work: precomputedWork,
          blockHash: account.frontier,
        })
      if (!isWorkValid) {
        setGeneratingWork(true)
        precomputedWork = await computeWorkAsync(
          account.frontier ?? account.publicKey,
          { send: true }
        )
        setGeneratingWork(false)
      }
      if (precomputedWork === null) throw new Error('cant_compute_work')

      const processResponse = await changeRepresentative(
        {
          representativeAddress: newRepresentative,
          walletBalanceRaw: account.balance,
          address: account.address,
          frontier: account.frontier,
          work: precomputedWork,
        },
        account.index,
        {
          challenge: challenge!,
          rawId: credentialId!,
          encryptedSeed: encryptedSeed!,
        }
      )

      consumePrecomputedWork(account.address)
      const work = await computeWorkAsync(processResponse.hash, { send: false })
      setAccount({
        ...account,
        frontier: processResponse.hash,
        representative: newRepresentative,
        ...(work !== null ? { precomputedWork: work } : {}),
      })
    },
    [account, setAccount, challenge, encryptedSeed, credentialId]
  )

  return { changeRep, generatingWork }
}

export default useChangeRepresentative
