import { block } from 'nanocurrency-web'

import decryptSeed from '../decryptSeed'
import fetcher from '../fetcher'
import { ProcessResponse } from '../types'
import accountAtIndex from './accountAtIndex'
import { defaultUrls } from './constants'

const receiveNano = async (
  blockData: Parameters<typeof block['receive']>[0],
  index: number,
  seedParams: {
    challenge: Uint8Array
    rawId: Uint8Array
    encryptedSeed: string
  }
) => {
  let seed = await decryptSeed(seedParams)
  let privateKey = accountAtIndex(seed, index).privateKey
  seed = '' // minimize its time in memory

  const signedBlock = block.receive(blockData, privateKey)
  privateKey = '' // minimize its time in memory
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

export default receiveNano
