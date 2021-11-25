import { block } from 'nanocurrency-web'

import decryptSeed from '../decryptSeed'
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
  return signedBlock
}

export default sendNano
