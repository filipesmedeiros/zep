import { hashBlock } from 'nanocurrency'
import { useCallback } from 'react'

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

  const send = useCallback(
    async (to: string, amount: string) => {
      if (
        account === undefined ||
        account.balance === null ||
        account.representative === null ||
        account.frontier === null
      )
        throw new Error('wrong_block_data') // todo improve this error
      const signedBlock = await sendNano(
        {
          walletBalanceRaw: account.balance,
          fromAddress: account.address,
          toAddress: to,
          representativeAddress: account.representative,
          frontier: account.frontier,
          amountRaw: amount,
          work: (await getPrecomputedWork(account.address)) ?? undefined,
        },
        account.index
      )
    },
    [account]
  )

  return send
}

export default useSendNano
