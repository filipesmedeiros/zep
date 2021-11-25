import { computeWork, hashBlock } from 'nanocurrency'
import { useCallback } from 'react'

import { useAccount } from '../context/accountContext'
import fetcher from '../fetcher'
import receiveNano from '../nano/receiveNano'

const useReceiveNano = () => {
  const account = useAccount()

  const receive = useCallback(
    async (hash: string, amount: string) => {
      if (account === undefined) return
      console.log('signing receive')
      const signedBlock = await receiveNano(
        {
          transactionHash: hash,
          walletBalanceRaw: account.balance ?? '0',
          toAddress: account.address,
          representativeAddress: account.representative ?? account.address,
          frontier:
            account.frontier ??
            '0000000000000000000000000000000000000000000000000000000000000000',
          amountRaw: amount,
          work: (await computeWork(account.frontier ?? account.publicKey))!,
        },
        account.index
      )
      console.log('finished signing')
      return fetcher('https://mynano.ninja/api/node', {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: JSON.stringify({
          action: 'process',
          json_block: 'true',
          subtype: 'receive',
          block: signedBlock,
        }),
      })
    },
    [account]
  )

  return receive
}

export default useReceiveNano
