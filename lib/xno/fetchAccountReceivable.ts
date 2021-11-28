import fetcher from '../fetcher'
import { AccountHistoryResponse } from '../types'

const fetchAccountReceivable = (
  address: string,
  count = 20,
  head = undefined,
  version22 = false
) =>
  fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    body: {
      action: version22 ? 'account_pending' : 'account_receivable',
      account: address,
      head,
      count,
    },
  }) as Promise<AccountHistoryResponse>

// most nodes haven't upgraded yet https://docs.nano.org/commands/rpc-protocol/#accounts_pending
// this will be the future api for this function
const withVersionFallback = (address: string, count = 20, head = undefined) =>
  fetchAccountReceivable(address, count, head).catch(() =>
    fetchAccountReceivable(address, count, head, true)
  )

export default withVersionFallback
