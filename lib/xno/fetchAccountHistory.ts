import fetcher from '../fetcher'
import { AccountHistoryResponse } from '../types'

const fetchAccountHistory = (address: string, count = 20, head = undefined) =>
  fetcher('https://mynano.ninja/api/node', {
    method: 'POST',
    body: {
      action: 'account_history',
      account: address,
      head,
      count,
    },
  }) as Promise<AccountHistoryResponse>

export default fetchAccountHistory
