import fetcher from '../fetcher'
import type { BlocksInfoResponse } from '../types'

const fetchBlocksInfo = (hashes: string[]) =>
  fetcher('https://proxy.powernode.cc/proxy', {
    method: 'POST',
    body: {
      action: 'blocks_info',
      json_block: 'true',
      hashes,
    },
  }) as Promise<BlocksInfoResponse>

export default fetchBlocksInfo
