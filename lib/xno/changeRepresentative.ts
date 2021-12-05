import { block } from 'nanocurrency-web'

import decryptSeed from '../decryptSeed'
import fetcher from '../fetcher'
import { ProcessResponse } from '../types'
import accountAtIndex from './accountAtIndex'
import { defaultUrls } from './constants'

const changeRepresentative = async (
  blockData: Parameters<typeof block['representative']>[0],
  index: number,
  seedParams: {
    challenge: Uint8Array
    rawId: Uint8Array
  }
) => {
  let seed = await decryptSeed(seedParams)
  const { privateKey } = accountAtIndex(seed, index)
  seed = '' // minimize its time in memory

  const signedBlock = block.representative(blockData, privateKey)
  const processResponse = await fetcher<ProcessResponse>(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: 'process',
      json_block: 'true',
      subtype: 'change',
      block: signedBlock,
    },
  })

  if ('error' in processResponse) throw new Error()

  return processResponse
}

export default changeRepresentative
