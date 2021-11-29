import fetcher from '../fetcher'
import type { BlocksInfoResponse } from '../types'
import { defaultUrls } from './constants'

const fetchBlocksInfo = (hashes: string[]) =>
  fetcher(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: 'blocks_info',
      json_block: 'true',
      hashes,
    },
  }) as Promise<BlocksInfoResponse>

export default fetchBlocksInfo
