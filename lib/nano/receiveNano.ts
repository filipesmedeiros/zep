import { computeWork, hashBlock } from 'nanocurrency'
import { block, wallet } from 'nanocurrency-web'

import decryptSeed from '../decryptSeed'
import fetcher from '../fetcher'

const receiveNano = async (myAddress: string, hash: string, amount: string) => {
  const accountInfo: any = await fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify({
      action: 'account_info',
      account: myAddress,
    }),
  })

  if ('error' in accountInfo) {
    const seed = await decryptSeed('os')
    console.log('start work')
    const work = (await computeWork(wallet.accounts(seed, 0, 0)[0].publicKey, {
      workThreshold: 'fffffe0000000000',
    }))!
    console.log('end work')
    const data = {
      walletBalanceRaw: '0',
      toAddress: myAddress,
      representativeAddress: myAddress,
      frontier:
        '0000000000000000000000000000000000000000000000000000000000000000',
      amountRaw: amount,
      transactionHash: hash,
      work,
    }
    console.log(seed)
    const signedBlock = block.receive(
      data,
      wallet.accounts(seed, 0, 0)[0].privateKey
    )
    console.log(signedBlock)

    const res: any = await fetcher('https://mynano.ninja/api/node', {
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify({
        action: 'process',
        json_block: 'true',
        subtype: 'open',
        block: signedBlock,
      }),
    })

    console.log(res)
  }
}

export default receiveNano
