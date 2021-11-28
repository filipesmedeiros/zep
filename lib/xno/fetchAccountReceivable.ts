import fetcher from '../fetcher'
import type { AccountReceivableResponse } from '../types'

const _fetchAccountReceivable = (
  address: string,
  count = 20,
  version22 = false
) =>
  fetcher('https://proxy.powernode.cc/proxy', {
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
  _fetchAccountReceivable(address, count).catch(() =>
    _fetchAccountReceivable(address, count, true)
  )

export default fetchAccountReceivable
