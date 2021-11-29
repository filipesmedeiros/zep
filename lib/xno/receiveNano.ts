import { hashBlock } from 'nanocurrency'
import { block } from 'nanocurrency-web'

import computeWorkAsync from '../computeWorkAsync'
import { addPrecomputedWork, consumePrecomputedWork } from '../db/accounts'
import decryptSeed from '../decryptSeed'
import fetcher from '../fetcher'
import { ProcessResponse } from '../types'
import accountAtIndex from './accountAtIndex'
import { defaultUrls } from './constants'

const sendNano = async (
  blockData: Parameters<typeof block['receive']>[0],
  index: number
) => {
  const { privateKey } = accountAtIndex(
    await decryptSeed('os'), // inline to minimize it's time in memoty (doesn't create a scoped var)
    index
  )

  const signedBlock = block.receive(blockData, privateKey)
  const processResponse = await fetcher<ProcessResponse>(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: 'process',
      json_block: 'true',
      subtype: 'receive',
      block: signedBlock,
    },
  })

  if ('error' in processResponse) throw new Error()

  return processResponse
}

export default sendNano
