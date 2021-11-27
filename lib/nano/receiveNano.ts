import { hashBlock } from 'nanocurrency'
import { block } from 'nanocurrency-web'

import decryptSeed from '../decryptSeed'
import accountAtIndex from './accountAtIndex'

const sendNano = async (
  blockData: Parameters<typeof block['receive']>[0],
  index: number
) => {
  const { privateKey } = accountAtIndex(
    await decryptSeed('os'), // inline to minimize it's time in memoty (doesn't create a scoped var)
    index
  )

  const signedBlock = block.receive(blockData, privateKey)
  return signedBlock
}

export default sendNano
