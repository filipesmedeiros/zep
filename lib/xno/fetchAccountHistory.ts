import fetcher from '../fetcher'
import { AccountHistoryResponse } from '../types'

const fetchAccountHistory = (address: string, count = 20, head = undefined) =>
  fetcher('https://proxy.powernode.cc/proxy', {
    method: 'POST',
    body: {
      action: 'account_history',
      account: address,
      head,
      count,
    },
  }) as Promise<AccountHistoryResponse>

export default fetchAccountHistory
