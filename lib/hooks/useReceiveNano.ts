import { computeWork, hashBlock } from 'nanocurrency'
import { useCallback, useState } from 'react'

import computeWorkAsync from '../computeWorkAsync'
import { useAccount } from '../context/accountContext'
import { getPrecomputedWork } from '../db/accounts'
import fetcher from '../fetcher'
import { zeroString } from '../xno/constants'
import receiveNano from '../xno/receiveNano'

const useReceiveNano = () => {
  const account = useAccount()
  const [generatingWork, setGeneratingWork] = useState(false)

  const receive = useCallback(
    async (hash: string, amount: string) => {
      if (account === undefined) return
      let precomputedWork = await getPrecomputedWork(account.address)
      if (precomputedWork === null) {
        setGeneratingWork(true)
        precomputedWork = await computeWorkAsync(
          account.frontier ?? account.address,
          { send: false }
        )
        setGeneratingWork(false)
      }
      if (precomputedWork === null) throw new Error('couldnt_compute_work')
      await receiveNano(
        {
          transactionHash: hash,
          walletBalanceRaw: account.balance ?? '0',
          toAddress: account.address,
          representativeAddress: account.representative ?? account.address,
          frontier: account.frontier ?? zeroString,
          amountRaw: amount,
          work: precomputedWork,
        },
        account.index
      )
    },
    [account]
  )

  return { receive, generatingWork }
}

export default useReceiveNano
