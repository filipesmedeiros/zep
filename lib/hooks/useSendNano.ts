import { computeWork } from 'nanocurrency'
import { useCallback } from 'react'

import { useAccount } from '../context/accountContext'
import fetcher from '../fetcher'
import sendNano from '../nano/sendNano'

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
        return
      const signedBlock = sendNano(
        {
          walletBalanceRaw: account.balance,
          fromAddress: account.address,
          toAddress: to,
          representativeAddress: account.representative,
          frontier: account.frontier,
          amountRaw: amount,
          work: (await computeWork(account.frontier))!,
        },
        account.index
      )
      return fetcher('https://mynano.ninja/api/node', {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          action: 'process',
          json_block: 'true',
          subtype: 'send',
          block: signedBlock,
        }),
      })
    },
    [account]
  )

  return send
}

export default useSendNano
