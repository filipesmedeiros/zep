import Big from 'bignumber.js'
import { validateWork } from 'nanocurrency'
import { useCallback, useState } from 'react'

import computeWorkAsync from '../computeWorkAsync'
import { useAccount, useAccounts } from '../context/accountContext'
import { consumePrecomputedWork, getPrecomputedWork } from '../db/accounts'
import { zeroString } from '../xno/constants'
import receiveNano from '../xno/receiveNano'
import useChallenge from './useChallenge'
import useCredentialId from './useCredentialId'
import useEncryptedSeed from './useEncryptedSeed'

const useReceiveNano = () => {
  const account = useAccount()
  const { setAccount } = useAccounts()
  const [generatingWork, setGeneratingWork] = useState(false)

  const { encryptedSeed } = useEncryptedSeed()
  const { challenge } = useChallenge()
  const { credentialId } = useCredentialId()

  const receive = useCallback(
    async (
      hash: string,
      amount: string,
      seedParams: {
        challenge: Uint8Array
        rawId: Uint8Array
      }
    ) => {
      if (account === undefined) return
      let precomputedWork = await getPrecomputedWork(account.address)
      const isWorkValid =
        precomputedWork !== null &&
        validateWork({
          work: precomputedWork,
          blockHash: account.frontier ?? account.publicKey,
        })
      if (!isWorkValid) {
        setGeneratingWork(true)
        precomputedWork = await computeWorkAsync(
          account.frontier ?? account.publicKey,
          { send: false }
        )
        setGeneratingWork(false)
      }
      if (precomputedWork === null) throw new Error('cant_compute_work')
      const processResponse = await receiveNano(
        {
          transactionHash: hash,
          walletBalanceRaw: account.balance ?? '0',
          toAddress: account.address,
          representativeAddress: account.representative ?? account.address,
          frontier: account.frontier ?? zeroString,
          amountRaw: amount,
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
      const work = await computeWorkAsync(processResponse.hash, {
        send: true,
      })
      setAccount({
        ...account,
        frontier: processResponse.hash,
        balance: new Big(account.balance ?? 0).plus(new Big(amount)).toString(),
        ...(work !== null ? { precomputedWork: work } : {}),
      })
    },
    [account, setAccount, challenge, credentialId, encryptedSeed]
  )

  return { receive, generatingWork }
}

export default useReceiveNano
