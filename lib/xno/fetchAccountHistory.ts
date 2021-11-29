import fetcher from '../fetcher'
import { AccountHistoryResponse } from '../types'
import { defaultUrls } from './constants'

const fetchAccountHistory = (address: string, count = 20, head = undefined) =>
  fetcher(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: 'account_history',
      account: address,
      head,
      count,
    },
  }) as Promise<AccountHistoryResponse>

export default fetchAccountHistory
