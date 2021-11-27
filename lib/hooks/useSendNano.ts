import { useCallback } from 'react'

import { useAccount } from '../context/accountContext'
import { consumePrecomputedWork, getPrecomputedWork } from '../db/accounts'
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
      return fetch('https://mynano.ninja/api/node', {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          action: 'process',
          json_block: 'true',
          subtype: 'send',
          block: signedBlock,
        }),
      })
        .then(res => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then(data => {
          if ('error' in data) throw new Error()
          consumePrecomputedWork(account.address)
        })
    },
    [account]
  )

  return send
}

export default useSendNano
