import { validateWork } from 'nanocurrency'
import { useCallback, useState } from 'react'

import computeWorkAsync from '../computeWorkAsync'
import { useAccount, useAccounts } from '../context/accountContext'
import { consumePrecomputedWork, getPrecomputedWork } from '../db/accounts'
import changeRepresentative from '../xno/changeRepresentative'

const useChangeRepresentative = () => {
  const account = useAccount()
  const { setAccount } = useAccounts()
  const [generatingWork, setGeneratingWork] = useState(false)

  const changeRep = useCallback(
    async (
      newRepresentative: string,
      seedParams: {
        challenge: Uint8Array
        rawId: Uint8Array
      }
    ) => {
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
        seedParams
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
    [account, setAccount]
  )

  return { changeRep, generatingWork }
}

export default useChangeRepresentative
