import fetcher from '../fetcher'
import type { BlocksInfoResponse } from '../types'

const fetchBlocksInfo = (hashes: string[]) =>
  fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    body: {
      action: 'blocks_info',
      json_block: 'true',
      hashes,
    },
  }) as Promise<BlocksInfoResponse>

export default fetchBlocksInfo
