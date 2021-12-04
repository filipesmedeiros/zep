import fetcher from '../fetcher'
import type { AccountReceivableResponse } from '../types'
import { defaultUrls } from './constants'

const _fetchAccountReceivable = (
  address: string,
  count = 20,
  version22 = false
) =>
  fetcher(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: version22 ? 'accounts_pending' : 'accounts_receivable',
      accounts: [address],
      count,
      threshold: '0',
      source: 'true',
    },
  }) as Promise<AccountReceivableResponse>

// most nodes haven't upgraded yet https://docs.nano.org/commands/rpc-protocol/#accounts_pending
// this will be the future api for this function
const fetchAccountReceivable = async (address: string, count = 20) =>
  _fetchAccountReceivable(address, count, true).catch(() =>
    _fetchAccountReceivable(address, count)
  )

export default fetchAccountReceivable
