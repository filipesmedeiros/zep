import { hashBlock } from 'nanocurrency'
import { block } from 'nanocurrency-web'

import computeWorkAsync from '../computeWorkAsync'
import { addPrecomputedWork, consumePrecomputedWork } from '../db/accounts'
import decryptSeed from '../decryptSeed'
import fetcher from '../fetcher'
import { ProcessResponse } from '../types'
import accountAtIndex from './accountAtIndex'

const sendNano = async (
  blockData: Parameters<typeof block['send']>[0],
  index: number
) => {
  const { privateKey } = accountAtIndex(
    await decryptSeed('os'), // inline to minimize it's time in memoty (doesn't create a scoped var)
    index
  )

  const signedBlock = block.send(blockData, privateKey)
  return fetcher<ProcessResponse>('https://mynano.ninja/api/node', {
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body: JSON.stringify({
      action: 'process',
      json_block: 'true',
      subtype: 'send',
      block: signedBlock,
    }),
  }).then(async data => {
    if ('error' in data) throw new Error()
    await consumePrecomputedWork(blockData.fromAddress)
    const work = await computeWorkAsync(hashBlock(signedBlock), { send: true })
    if (work !== null) addPrecomputedWork(blockData.fromAddress, work)
  })
}

export default sendNano
