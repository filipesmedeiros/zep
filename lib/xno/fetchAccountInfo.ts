import fetcher from '../fetcher'
import { AccountInfoResponse } from '../types'
import { defaultUrls } from './constants'

const fetchAccountInfo = (address: string) =>
  fetcher(defaultUrls.rpc, {
    method: 'POST',
    body: {
      action: 'account_info',
      account: address,
      representative: 'true',
      include_confirmed: 'true',
    },
  }) as Promise<AccountInfoResponse>

export default fetchAccountInfo
