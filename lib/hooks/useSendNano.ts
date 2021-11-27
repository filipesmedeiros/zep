import { hashBlock } from 'nanocurrency'
import { useCallback, useState } from 'react'

import computeWorkAsync from '../computeWorkAsync'
import { useAccount } from '../context/accountContext'
import {
  addPrecomputedWork,
  consumePrecomputedWork,
  getPrecomputedWork,
} from '../db/accounts'
import sendNano from '../xno/sendNano'

const useSendNano = () => {
  const account = useAccount()
  const [generatingWork, setGeneratingWork] = useState(false)

  const send = useCallback(
    async (to: string, amount: string) => {
      if (
        account === undefined ||
        account.balance === null ||
        account.representative === null ||
        account.frontier === null
      )
        throw new Error('wrong_block_data') // todo improve this error
      let precomputedWork = await getPrecomputedWork(account.address)
      if (precomputedWork === null) {
        setGeneratingWork(true)
        precomputedWork = await computeWorkAsync(
          account.frontier ?? account.address,
          { send: true }
        )
        setGeneratingWork(false)
      }
      if (precomputedWork === null) throw new Error('couldnt_compute_work')
      await sendNano(
        {
          walletBalanceRaw: account.balance,
          fromAddress: account.address,
          toAddress: to,
          representativeAddress: account.representative,
          frontier: account.frontier,
          amountRaw: amount,
          work: precomputedWork,
        },
        account.index
      )
    },
    [account]
  )

  return { send, generatingWork }
}

export default useSendNano
